import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const auth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.user = { id: decoded.id };
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export default auth;