import { Response, Request } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import Category from "../model/category";
import SlugGenrator from "../utils/slug";

/*
 *Curd operation with category
 */

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, img_Base64, slug, subName, description } = req.body;
    if (
      !name ||
      !img_Base64 ||
      !slug ||
      !subName ||
      !description ||
      slug.length < 3 ||
      name.length < 3 ||
      img_Base64.length < 3 ||
      subName.length < 3 ||
      description.length < 3
    ) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All fields are required" });
      return;
    }
    const categorySlug = await Category.findOne({ slug });
    if (categorySlug) {
      const newSlug = await SlugGenrator(slug, Category);
      console.log(newSlug, slug);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Category already exists same slug ",
        slugSegged: newSlug,
      });
      return;
    }
    const category = await Category.create({
      name,
      img_Base64,
      slug,
      subName,
      description,
    });
    res.status(201).json({ message: "Category created", category });
  }
);

export const getAllCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const { pageNumber = 1, limit = 10, searchTerm } = req.query;
    if (searchTerm && !!searchTerm) {
      const searchRegex = new RegExp(`^${searchTerm}`, "i");
      const totalCount = await Category.countDocuments({
        $or: [{ name: searchRegex }, { slug: searchRegex }],
      });
      const categories = await Category.find({
        $or: [{ name: searchRegex }, { slug: searchRegex }],
      })
        .skip((Number(pageNumber) - 1) * Number(limit))
        .limit(Number(limit))
        .sort({ _id: -1 });
      if (!categories || categories.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Categories not found" });
        return;
      }
      res.status(StatusCodes.OK).json({ count: totalCount, categories });
      return;
    }
    const totalCount = await Category.countDocuments({});
    const categories = await Category.find({})
      .skip((Number(pageNumber) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ _id: -1 });
    if (!categories || categories.length === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Categories not found" });
      return;
    }
    res.status(StatusCodes.OK).json({ count: totalCount, categories });
    return;
  }
);

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const { slug, _id, name } = req.query;
  if (!slug && !_id && !name) {
    const category = await Category.find();
    res.status(StatusCodes.OK).json({ category });
    return;
  }
  if ((slug && _id) || (name && _id)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Only one field is required in query" });
    return;
  }
  if (slug && !_id && !name) {
    const searchTerm = new RegExp(`^${slug}`, "i");

    const category = await Category.find({ slug: searchTerm });
    if (!category) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
      return;
    }
    res.status(StatusCodes.OK).json({ category });
    return;
  }
  if (_id) {
    const category = await Category.findById(_id);
    if (!category) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
      return;
    }
    res.status(StatusCodes.OK).json({ category });
    return;
  }
  if (name && !slug) {
    const searchTerm = new RegExp(`^${name}`, "i");
    const category = await Category.find({ name: searchTerm });
    if (!category) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
      return;
    }
    res.status(StatusCodes.OK).json({ category });
    return;
  }
  const category = await Category.find({
    name: { $regex: name, $options: "i" },
    slug: { $regex: slug, $options: "i" },
  });
  if (!category) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
    return;
  }
  res.status(StatusCodes.OK).json({ category });
  return;
});

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, img_Base64, slug } = req.body;
    const { _id } = req.params;
    const category = await Category.findById(_id);
    if (!category) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
      return;
    }
    // category.name = name;
    // category.img_Base64 = img_Base64;
    // category.slug = slug;
    const res1 = await Category.updateOne({ _id }, req.body, {
      new: true,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Category updated", category: res1 });
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id } = req.params;
    const category = await Category.findById(_id);
    if (!category) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
      return;
    }
    await Category.findByIdAndDelete(_id);
    res.status(StatusCodes.OK).json({ message: "Category deleted" });
  }
);
