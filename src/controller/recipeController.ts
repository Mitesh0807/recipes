import { Response, Request } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import Category from "../model/category";
import SlugGenrator from "../utils/slug";
import Recipe from "../model/recipe";
import mongoose from "mongoose";
/*
 * Curd operation with Recipe
 * create
 * get by query
 * update
 * delete
 * pagination
 * */

export const createRecipe = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      img_Base64,
      slug,
      categoryId,
      description,
      cookingTime,
      ingredients,
      additionalNotes,
    } = req.body;
    if (
      !name ||
      !slug ||
      !categoryId ||
      !description ||
      !cookingTime ||
      !ingredients
    ) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All fields are required" });
      return;
    }
    const recipeSlug = await Recipe.findOne({ slug });
    if (recipeSlug) {
      const newSlug = await SlugGenrator(slug, Recipe);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Recipe already exists same slug ",
        slugSegged: newSlug,
      });
      return;
    }
    const recipe = await Recipe.create({
      name,
      img_Base64,
      slug,
      categoryId,
      description,
      cookingTime,
      ingredients,
      additionalNotes,
    });
    res.status(201).json({ message: "Recipe created", recipe });
    return;
  }
);

export const getRecipeByQuery = asyncHandler(
  async (req: Request, res: Response) => {
    const { searchTerm, pageNumber = 1, limit = 10 } = req.query;
    try {
      if (searchTerm && !!searchTerm) {
        const searchRegex = new RegExp(`^${searchTerm}`, "i");
        const totalCount = await Recipe.countDocuments({
          $or: [{ name: searchRegex }, { slug: searchRegex }],
        });
        const recipes = await Recipe.find({
          $or: [{ name: searchRegex }, { slug: searchRegex }],
        })
          .skip((Number(pageNumber) - 1) * Number(limit))
          .limit(Number(limit))
          .sort({ _id: -1 })
          .populate("categoryId");
        res.status(StatusCodes.OK).json({ count: totalCount, recipes });
        return;
      }
      const totalCount = await Recipe.countDocuments({});
      const recipes = await Recipe.find({})
        .skip((Number(pageNumber) - 1) * Number(limit))
        .limit(Number(limit))
        .sort({ _id: -1 })
        .populate("categoryId");
      res.status(StatusCodes.OK).json({ count: totalCount, recipes });
    } catch (error) {
      console.error("Error in getRecipeByQuery:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
);

export const getRecipeById = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id } = req.params;
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid id" });
      return;
    }
    const recipe = await Recipe.findById(_id).populate("categoryId");
    if (!recipe) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Recipe not found" });
      return;
    }
    res.status(StatusCodes.OK).json({ recipe });
    return;
  }
);

export const updateRecipe = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      img_Base64,
      slug,
      categoryId,
      description,
      cookingTime,
      ingredients,
    } = req.body;
    const { _id } = req.params;
    const recipe = await Recipe.findById(_id);
    if (!recipe) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Recipe not found" });
      return;
    }
    if (
      !name &&
      !img_Base64 &&
      !slug &&
      !categoryId &&
      !description &&
      !cookingTime &&
      !ingredients
    ) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "At least one field is required" });
      return;
    }
    recipe.name = name || recipe.name;
    recipe.img_Base64 = img_Base64 || recipe.img_Base64;
    recipe.slug = slug || recipe.slug;
    recipe.categoryId = categoryId || recipe.categoryId;
    recipe.description = description || recipe.description;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    recipe.ingredients = ingredients || recipe.ingredients;
    const response = await Recipe.updateOne({ _id }, req.body);
    res
      .status(StatusCodes.OK)
      .json({ message: "Recipe updated", recipe: response });
    return;
  }
);

export const deleteRecipe = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id } = req.params;
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid id" });
      return;
    }
    const recipe = await Recipe.findById(_id);
    if (!recipe) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Recipe not found" });
      return;
    }
    await Recipe.findByIdAndDelete(_id);
    res.status(StatusCodes.OK).json({ message: "Recipe deleted" });
    return;
  }
);
