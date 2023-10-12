
import { Response, Request } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import  Category  from "../model/category";
import  SlugGenrator  from "../utils/slug";
import  Recipe  from "../model/recipe";
/*
 * Curd operation with Recipe
 * create 
 * get by query
 * update
 * delete
 * pagination 
 * */


export const createRecipe = asyncHandler(async (req: Request, res: Response) => {
  const { name, img_Base64, slug, categoryId, description, cookingTime, ingredients } = req.body;
  if (!name || !slug || !categoryId || !description || !cookingTime || !ingredients) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
    return;
  }
  const recipeSlug = await Recipe.findOne({ slug });
  if (recipeSlug) {
      const newSlug =await SlugGenrator(slug, Recipe);
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Recipe already exists same slug ", slugSegged: newSlug });
      return;
  }
  const recipe = await Recipe.create({ name, img_Base64, slug, categoryId, description, cookingTime, ingredients });
  res.status(201).json({ message: "Recipe created", recipe });
  return;
});


export const getRecipeByQuery = asyncHandler(async (req: Request, res: Response) => {
  const { slug, name } = req.query;
  if (!slug && !name) {
    const recipe = await Recipe.find();
    res.status(StatusCodes.OK).json({ recipe });
    return;
  }
 if (slug && name) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Only one field is required in query" });
    return;
  }
  if (slug  && !name) {
    const searchTerm = new RegExp(`^${slug}` , 'i');
    const recipe = await Recipe.find({ slug: searchTerm });
    if (!recipe) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Recipe not found" });
      return;
    }
    res.status(StatusCodes.OK).json({ recipe });
    return;
  }
});

export const getRecipeById = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params;
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
  if(!name && !img_Base64 && !slug && !categoryId && !description && !cookingTime && !ingredients){
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
  return ;
});

