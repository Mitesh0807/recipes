import mongoose, { Schema, Document, Mongoose } from "mongoose";
import { ICategory } from "./category";

export interface IRecipe {
    name: string;
    quantity: number;
    unit: string;
    extraNote: string;
}

export interface IRecipe extends Document {
    _id: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    img_Base64: string;
    slug: string;
    categoryId: ICategory;
    ingredients: IRecipe[];
    description: string;
    cookingTime: string;
}


const RecipeSchema: Schema = new mongoose.Schema<IRecipe>({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    img_Base64: { type: String },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    ingredients: {
        type: [Object],
        of: {
            type: {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                unit: { type: String, required: true },
                extraNote: {
                    type: String,
                }
            }
        }
        , default: [], required: true
    },
    description: { type: String, required: true },
    cookingTime: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});


export default mongoose.model<IRecipe>("Recipe", RecipeSchema);
