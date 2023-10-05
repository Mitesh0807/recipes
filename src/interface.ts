import { Request as ExpressRequest } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
interface DecodedToken {
  email: string;
  role: string;
  _id: string;
}

interface Request extends ExpressRequest {
  decoded?: DecodedToken;
}
export default Request;
