import mongoose, { Schema, Document } from "mongoose";
// const bcrypt = require("bcryptjs");
export interface ISuperAdmin extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
const SuperAdminSchema: Schema = new mongoose.Schema<ISuperAdmin>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    password: { type: "String" },
    isActive: { type: "Boolean", default: true },
    createdAt: { type: "Date", default: Date.now },
    updatedAt: { type: "Date", default: Date.now },
  });

export default mongoose.model<ISuperAdmin>("SuperAdmin", SuperAdminSchema);
