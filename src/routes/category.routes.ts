import express, { Router } from "express";
const categoryRouter = express.Router();
import {createCategory, getAllCategories, getCategory, updateCategory, deleteCategory} from "../controller/categoryController";

categoryRouter.route("/").get(getAllCategories).post(createCategory);
categoryRouter.route("/getCategory").post(getCategory);
categoryRouter.route("/:_id").put(updateCategory).delete(deleteCategory);
export default categoryRouter;
