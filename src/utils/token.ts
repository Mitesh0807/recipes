import { sign } from "jsonwebtoken";


interface TokenPayload {
    _id: string;
    email: string;
    role: string;
}
const secret = "secret";

export const generateToken = (user: TokenPayload) => {
    const token = sign(user, secret, { expiresIn: "30m" });
    return token;
}