import express from "express";
import App from "./App.js";
import dotenv from "dotenv";
import "./db/Database.js";

dotenv.config();

const startServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 5000;
  App(app);

  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
};

startServer();