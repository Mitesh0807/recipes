import mongoose,{ Schema, Document} from "mongoose";

export interface ICategory extends Document {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  img_Base64: string;
  slug: string;
  subName: string;
  description: string;
}

const CategorySchema: Schema = new mongoose.Schema<ICategory>({
  createdAt: { type: Date, default: Date.now },
  description: { type: String, required: true },
  img_Base64: { type: String , required: true},
  isActive: { type: Boolean, default: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subName: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICategory>("Category", CategorySchema);

