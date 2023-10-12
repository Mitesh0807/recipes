import express, { Router } from "express";


const router: Router = express.Router();

import  superAdminRouter  from "./superAdmin.routes";
import categoryRouter from "./category.routes";
import recipeRouter from "./recipe.routes";
router.use("/admin", superAdminRouter);
router.use("/category", categoryRouter);
router.use("/recipe", recipeRouter);

export default router;
