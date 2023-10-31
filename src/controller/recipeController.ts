import { Response, Request } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import Category from "../model/category";
import SlugGenrator from "../utils/slug";
import Recipe from "../model/recipe";
import mongoose, { PipelineStage } from "mongoose";
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
const pipelineGenrator = (
  isCategory: boolean,
  isSearch: boolean,
  categoryId?: string,
  searchTerm?: string
) => {
  let pipeline;
  console.log(isCategory, isSearch, categoryId, searchTerm);
  if (isCategory && isSearch && categoryId) {
    console.log("category and search");
    pipeline = [
      {
        $match: {
          categoryId: new mongoose.Types.ObjectId(categoryId.toString()),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $match: {
          $or: [
            { name: new RegExp(`^${searchTerm}`, "i") },
            { slug: new RegExp(`^${searchTerm}`, "i") },
          ],
        },
      },
    ];
    return pipeline;
  } else if (isCategory && categoryId && !isSearch) {
    console.log("category ");
    pipeline = [
      {
        $match: {
          categoryId: new mongoose.Types.ObjectId(categoryId.toString()),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
    ];
    return pipeline;
  } else if (isSearch && !isCategory) {
    console.log("only search");
    pipeline = [
      {
        $match: {
          $or: [
            { name: new RegExp(`^${searchTerm}`, "i") },
            { slug: new RegExp(`^${searchTerm}`, "i") },
          ],
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
    ];
    return pipeline;
  } else if (!isCategory && !isSearch) {
    pipeline = [
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
    ];
    return pipeline;
  }
};
export const getRecipeByQuery = asyncHandler(
  async (req: Request, res: Response) => {
    const { searchTerm, pageNumber = 1, limit = 10, categoryId } = req.query;
    let pipeline;
    let isCategory = false;
    let isSearch = false;

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId.toString()))
      isCategory = true;
    if (searchTerm && !!searchTerm) isSearch = true;
    pipeline = pipelineGenrator(
      isCategory,
      isSearch,
      categoryId?.toString(),
      searchTerm?.toString()
    );
    console.log(pipeline, "pipeline");
    try {
      const totalCount = await Recipe.aggregate(pipeline).count("count");
      const recipes = await Recipe.aggregate(pipeline)
        .skip((Number(pageNumber) - 1) * Number(limit))
        .limit(Number(limit))
        .sort({ _id: -1 });
      res.status(StatusCodes.OK).json({ count: totalCount[0].count, recipes });
    } catch (error) {
      console.error("Error in getRecipeByQuery:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
);
// export const getRecipeByCategoryIdQuery = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { categoryId, pageNumber = 1, limit = 10, searchTerm } = req.query;

//     if (
//       !categoryId ||
//       (categoryId && !mongoose.Types.ObjectId.isValid(categoryId.toString()))
//     ) {
//       res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: "Invalid categoryId" });
//       return;
//     }
//     let pipeline;
//     if (searchTerm && !!searchTerm) {
//       const searchRegex = new RegExp(`^${searchTerm}`, "i");
//       pipeline = [
//         {
//           $match: {
//             categoryId: new mongoose.Types.ObjectId(categoryId.toString()),
//           },
//         },
//         {
//           $lookup: {
//             from: "categories",
//             localField: "categoryId",
//             foreignField: "_id",
//             as: "category",
//           },
//         },
//         {
//           $unwind: "$category",
//         },
//         {
//           $match: {
//             $or: [
//               { name: searchRegex ?? { $regex: searchRegex, $options: "i" } },
//               { slug: searchRegex ?? { $regex: searchRegex, $options: "i" } },
//             ],
//           },
//         },
//       ];
//     } else {
//       pipeline = [
//         {
//           $match: {
//             categoryId: new mongoose.Types.ObjectId(categoryId.toString()),
//           },
//         },
//         {
//           $lookup: {
//             from: "categories",
//             localField: "categoryId",
//             foreignField: "_id",
//             as: "category",
//           },
//         },
//         {
//           $unwind: "$category",
//         },
//       ];
//     }
//     const count = await Recipe.aggregate(pipeline).count("count");
//     const recipes = await Recipe.aggregate(pipeline)
//       .skip((Number(pageNumber) - 1) * Number(limit))
//       .limit(Number(limit));
//     res.status(StatusCodes.OK).json({ count: count[0].count, recipes });
//     return;
//   }
// );

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

export const getRecipeBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;
    const recipe = await Recipe.findOne({ slug }).populate("categoryId");
    if (!recipe) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Recipe not found" });
      return;
    }
    res.status(StatusCodes.OK).json({ recipe });
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
    const response = await Recipe.updateOne({ _id }, req.body, {
      new: true,
    }).populate("categoryId");
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
