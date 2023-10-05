import { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Request from "../interface";
import asyncHandler from "express-async-handler";
interface DecodedToken {
    email: string;
    role: string;
    _id: string;
}
const authMiddleware = asyncHandler(async (req: Request, res: Response, next: any) => {
    const token: string = req.headers.authorization || req.cookies.accessToken;
    if (!token || token === "") {
        res.status(401).json({
            message:
                "Access token missing please login again/or generate access token again",
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        req.decoded = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid access token",
        })
    }
}
)



