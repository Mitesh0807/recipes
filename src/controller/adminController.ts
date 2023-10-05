import { Response, Request } from "express";
import asyncHandler from "express-async-handler";
import { ISuperAdmin } from "../model/superAdmin";
import {SuperAdmin} from '../model'
import { StatusCodes } from "http-status-codes";
import { generateToken } from "../utils/token";


export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(StatusCodes.BAD_REQUEST).json({message: "All fields are required email and password"});
    }
    const superAdmin = await SuperAdmin.findOne({email});
    if (!superAdmin) {
        res.status(StatusCodes.NOT_FOUND).json({message: "Admin not found"});
        return;
    }
    const isPasswordMatch = superAdmin?.password === password;
    if (!isPasswordMatch) {
        res.status(StatusCodes.BAD_REQUEST).json({message: "Incorrect password"});
    }
    const token =generateToken({_id: superAdmin._id, email: superAdmin.email, role: "admin"});
    res.status(StatusCodes.OK).json({message: "Login success", superAdmin});
});


export const adminRegister = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;
    if(!firstName || !lastName || !email || !password || password.length < 6 || email.indexOf("@") === -1 || firstName.length < 3 || lastName.length < 3){
        res.status(StatusCodes.BAD_REQUEST).json({message: "All fields are required firstName, lastName, email and password must be at least 3 characters"});
    }
    const superAdmin = await SuperAdmin.findOne({email});
    if (superAdmin) {
        res.status(StatusCodes.BAD_REQUEST).json({message: "Admin already exists"});
    }
    const newSuperAdmin = await SuperAdmin.create({firstName, lastName, email, password});
    res.status(StatusCodes.CREATED).json({message: "Admin created", newSuperAdmin});
});


