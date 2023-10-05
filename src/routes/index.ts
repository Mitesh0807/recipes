import express, { Router } from "express";


const router: Router = express.Router();

import  superAdminRouter  from "./superAdmin.routes";


router.use("/admin", superAdminRouter);

export default router;