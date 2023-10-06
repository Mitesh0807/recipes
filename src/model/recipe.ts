import mongoose,{ Schema, Document} from "mongoose";

export interface IRecipe  {
    name: string;
    quantity: number;
    unit: string;
}
export interface IRecipe extends Document {
    _id: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    img_Base64: string;
    slug: string;
    category: string;
    ingredients: string[];
}