import express, { Router } from "express";
const superAdminRouter = express.Router();
import { adminLogin, adminRegister } from "../controller/adminController";

superAdminRouter.post("/login", adminLogin);
superAdminRouter.post("/register", adminRegister);

export default superAdminRouter;