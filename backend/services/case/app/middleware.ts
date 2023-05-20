import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwt";

export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
    };
}
//TODO: change req to authreq?
export function verifyUser(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const payload = verifyToken(token);
    if (!payload) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("payload", payload);
    // req.user = payload;
    next();
}

export function verifyCustomer(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'customer') {
        return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("payload", payload);
    // req.user = payload;
    next();
}

export function verifyAgent(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'agent') {
        return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("payload", payload);
    // req.user = payload;
    next();
}

export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
        return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("payload", payload);
    // req.user = payload;
    next();
}