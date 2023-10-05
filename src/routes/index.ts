import express, { Router } from "express";


const router: Router = express.Router();

import  superAdminRouter  from "./superAdmin.routes";
import categoryRouter from "./category.routes";

router.use("/admin", superAdminRouter);
router.use("/category", categoryRouter);

export default router;
