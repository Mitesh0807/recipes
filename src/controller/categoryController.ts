import { Response, Request } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import  Category  from "../model/category";

/*
 *Curd operation with category 
 */

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, img_Base64, slug } = req.body;
  if (!name || !img_Base64 || !slug || slug.length < 3 || name.length < 3 || img_Base64.length < 3 ) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
  } 
  const categorySlug = await Category.findOne({ slug });
  if (categorySlug) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Category already exists same slug "});
  } 
  const nameExist = await Category.findOne({ name });
  if (nameExist) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Category already exists same name" });
  }
  const category = await Category.create({ name, img_Base64, slug });
  res.status(201).json({ message: "Category created", category });
});


export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find();
  if (!categories || categories.length === 0) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Categories not found" })
    return;
  }
  res.status(StatusCodes.OK).json({ categories });
});


export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const {slug,_id,name}=req.query;
  if(!slug && !_id && !name){
    const category = await Category.find();
    res.status(StatusCodes.OK).json({ category });
    return ;
  }
  if(slug && _id || name && _id){
    res.status(StatusCodes.BAD_REQUEST).json({message:"Only one field is required in query"});
    return ;
  }
  if(slug && !_id && !name){
    const searchTerm = new RegExp(`^${slug}` , 'i'); 

    const category = await Category.find({ slug: searchTerm });
      if (!category) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
      return;
    }
    res.status(StatusCodes.OK).json({ category });
    return;
  }
  if(_id){
    const category = await Category.findById(_id);
    if (!category) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
      return;
    }
    res.status(StatusCodes.OK).json({ category });
    return ;
  }
  if(name && !slug){
    const searchTerm = new RegExp(`^${name}` , 'i');
    // const category = await Category.find("name":{$regex:name , $options:"i"});
    const category = await Category.find({ name: searchTerm });
    if (!category) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
      return;
    }
    res.status(StatusCodes.OK).json({ category });
    return ;
  }
  const category = await Category.find({name:{$regex:name , $options:"i"},slug:{$regex:slug , $options:"i"}});
  if (!category) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
    return;
  }
  res.status(StatusCodes.OK).json({ category });
  return; 
});


export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, img_Base64, slug } = req.body;
  const { _id } = req.params;
  const category = await Category.findById(_id);
  if (!category) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
    return;
  }
  category.name = name;
  category.img_Base64 = img_Base64;
  category.slug = slug;
  await category.save();
  res.status(StatusCodes.OK).json({ message: "Category updated", category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.params;
  const category = await Category.findById(_id);
  if (!category) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
    return;
  }
  await Category.findByIdAndDelete(_id);
  res.status(StatusCodes.OK).json({ message: "Category deleted" });
});

