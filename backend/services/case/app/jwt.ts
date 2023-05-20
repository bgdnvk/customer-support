import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = `${process.env.JWT}`;

export function generateToken(payload: any): string {
    return jwt.sign(payload, secret);
}

export function verifyToken(token: string): any {
    try {
        //TODO: remove
        console.log("jwt secret", secret);
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}
