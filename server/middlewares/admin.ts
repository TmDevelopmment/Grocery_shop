import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

const admin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userID = req.user?.id;
        if (!userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const user = await prisma.user.findUnique({ where: { id: userID } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const adminEmails = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.split(",").map((e) => e.trim().toLowerCase()) : [];
        
        if (!adminEmails.includes(user.email)) {
           if(req.user) req.user.isAdmin = true;
           next();
        } else {
            return res.status(403).json({ message: "Forbidden: Admins only" });
        }
    }
    catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: "Admin authentication failed", error: err.message });
    }
};

export default admin;