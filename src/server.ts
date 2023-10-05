import express from "express";
import connectToDb from "./connectDb/connectionDb";
const app = express();

import cors from "cors";

const server = (app: express.Application) => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}
server(app);