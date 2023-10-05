import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.set("strictQuery", false);
async function connectToDb(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGOURI as string, {});
    console.log("connected to db");
  } catch (error) {
    console.log("check db connection", error);
  }
}
export default connectToDb;
