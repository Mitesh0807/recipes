import express from "express";
import connectToDb from "./connectDb/connectionDb";

const app = express();

import cors from "cors";
import router from "./routes";
connectToDb();
app.use(cors({
  origin:"*",
  credentials:true,
  exposedHeaders:"Authorization",
  methods:"GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);

const server = (app: express.Application) => {
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
}
server(app);
