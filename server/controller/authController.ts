import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// Generate JWT token
const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
}

// Check if user is admin
const getAdminStatus = async (email: string | null | undefined) : boolean =>  {
    if (!email) return false;
    const adminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.split(",").map(e => e.trim().toLowerCase()) : [];
    return adminEmail.includes(email.toLowerCase());
};

//Register
//Post /api/auth/register
export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email and password are required" });
    }
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        }
    });

    const token = generateToken(user.id);

    const userData : any = {...user};
    delete userData.password;
    userData.isAdmin = getAdminStatus(userData.email);

    res.status(201).json({ message: "User created successfully", user: userData, token });
};

// Login
// Post /api/auth/login
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase()},include: { addresses: true } });
    
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    const userData : any = {...user};
    delete userData.password;
    userData.isAdmin = getAdminStatus(userData.email);

    res.json({ message: "Login successful", user: userData, token });
};