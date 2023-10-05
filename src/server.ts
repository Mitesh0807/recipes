import express from "express";
import connectToDb from "./connectDb/connectionDb";

const app = express();

import cors from "cors";
import router from "./routes";
connectToDb();
app.use(cors());
app.use(express.json());
app.use("/", router);

const server = (app: express.Application) => {
  app.listen(8000, () => {
    console.log("Server is running on port 3000");
  });
}
server(app);