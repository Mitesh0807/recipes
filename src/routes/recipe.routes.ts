import express, { Router } from "express";
const recipeRouter = express.Router();
import {
  createRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipeByQuery,
  updateRecipe,
  getRecipeBySlug,
} from "../controller/recipeController";
import authMiddleware from "../middleware/authMiddleware";

recipeRouter
  .route("/")
  .get(getRecipeByQuery)
  .post(authMiddleware, createRecipe);
recipeRouter
  .route("/:_id")
  .put(authMiddleware, updateRecipe)
  .get(getRecipeById)
  .delete(authMiddleware, deleteRecipe);
recipeRouter.route("/getRecipeBySlug/:slug").get(getRecipeBySlug);

export default recipeRouter;
