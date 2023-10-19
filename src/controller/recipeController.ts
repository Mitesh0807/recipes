
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


export const createRecipe = asyncHandler(async (req: Request, res: Response) => {
  const { name, img_Base64, slug, categoryId, description, cookingTime, ingredients,additionalNotes } = req.body;
  if (!name || !slug || !categoryId || !description || !cookingTime || !ingredients) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
    return;
  }
  const recipeSlug = await Recipe.findOne({ slug });
  if (recipeSlug) {
    const newSlug = await SlugGenrator(slug, Recipe);
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Recipe already exists same slug ", slugSegged: newSlug });
    return;
  }
  const recipe = await Recipe.create({ name, img_Base64, slug, categoryId, description, cookingTime, ingredients ,additionalNotes});
  res.status(201).json({ message: "Recipe created", recipe });
  return;
});


export const getRecipeByQuery = asyncHandler(async (req: Request, res: Response) => {
  const { slug, name, pageNumber = 1, limit = 10 } = req.query;
  let query: any = {}; 
  try {
    // if (!slug && !name) {
    //   const recipes = await Recipe.find();
    //   res.status(StatusCodes.OK).json({ recipes });
    //   return;
    // }
    if (slug && name) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Only one field is required in the query" });
      return;
    }
    if (slug && !name) {
      query = {
        ...query,
        slug: new RegExp(`^${slug}`, 'i')
      }
    }
    if (name && !slug) {
      query = {
        ...query,
        name: new RegExp(`^${name}`, 'i')
      }
    }
    const totalCount = await Recipe.countDocuments({});
    const recipes = await Recipe.find(query)
      .skip((Number(pageNumber) - 1) * Number(limit))
      .sort({ _id: -1 })
      .populate('categoryId');
    res.status(StatusCodes.OK).json({ count: totalCount, recipes });
  } catch (error) {
    console.error('Error in getRecipeByQuery:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
});

export const getRecipeById = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params;
  if(!_id || !mongoose.Types.ObjectId.isValid(_id)){
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid id" });
    return;
  }
  const recipe = await Recipe.findById(_id);
  if (!recipe) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Recipe not found" });
    return;
  }
  res.status(StatusCodes.OK).json({ recipe });
  return;
});


export const updateRecipe = asyncHandler(async (req: Request, res: Response) => {
  const { name, img_Base64, slug, categoryId, description, cookingTime, ingredients } = req.body;
  const { _id } = req.params;
  const recipe = await Recipe.findById(_id);
  if (!recipe) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Recipe not found" });
    return;
  }
  if (!name && !img_Base64 && !slug && !categoryId && !description && !cookingTime && !ingredients) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "At least one field is required" });
    return;
  }
  recipe.name = name || recipe.name;
  recipe.img_Base64 = img_Base64 || recipe.img_Base64;
  recipe.slug = slug || recipe.slug;
  recipe.categoryId = categoryId || recipe.categoryId;
  recipe.description = description || recipe.description;
  recipe.cookingTime = cookingTime || recipe.cookingTime;
  recipe.ingredients = ingredients || recipe.ingredients;
  await recipe.save();
  res.status(StatusCodes.OK).json({ message: "Recipe updated", recipe });
  return;
});

