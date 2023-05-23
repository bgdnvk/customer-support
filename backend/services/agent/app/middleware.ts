import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = `${process.env.JWT_SECRET}`;

// export function generateToken(payload: any): string {
//     return jwt.sign(payload, secret);
// }

export function verifyToken(token: string): any {
    try {
        // console.log("jwt secret", secret);
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}

export function verifyCustomer(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("middleware hit verify customer");
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const payload = verifyToken(token);
    if (!payload || payload.role !== "customer") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    //TODO: remove
    console.log("payload", payload);
    //make sure the req body is defined as I will be passing data through it
    req.body = req.body || {};
    req.body.payload = payload;
    next();
}

export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
    console.log("middleware hit");
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const payload = verifyToken(token);
    if (!payload || payload.role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    //TODO: remove
    console.log("payload", payload);
    req.body.payload = payload;

    next();
}
