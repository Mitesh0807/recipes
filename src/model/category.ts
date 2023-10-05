import mongoose,{ Schema, Document} from "mongoose";

export interface ICategory extends Document {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  img_Base64: string;
  slug: string;
}

const CategorySchema: Schema = new mongoose.Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  img_Base64: { type: String , required: true},
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICategory>("Category", CategorySchema);
