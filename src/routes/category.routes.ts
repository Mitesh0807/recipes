import express, { Router } from "express";
const categoryRouter = express.Router();
import { createCategory, getAllCategories, getCategory, updateCategory, deleteCategory } from "../controller/categoryController";
import authMiddleware from "../middleware/authMiddleware";
categoryRouter.route("/").get(getAllCategories).post(authMiddleware, createCategory);
categoryRouter.route("/getCategory").get(getCategory);
categoryRouter.route("/:_id").put(authMiddleware,updateCategory).delete(authMiddleware,deleteCategory);
export default categoryRouter;
