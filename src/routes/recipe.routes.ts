
import express, { Router } from "express";
const recipeRouter = express.Router();
import { createRecipe, getRecipeByQuery, updateRecipe} from "../controller/recipeController";  
import authMiddleware from "../middleware/authMiddleware";

recipeRouter.route("/").get(getRecipeByQuery).post(authMiddleware,createRecipe);
recipeRouter.route("/:_id").put(authMiddleware,updateRecipe);
export default recipeRouter;