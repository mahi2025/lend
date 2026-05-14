import express from "express";
import App from "./services/App.js";
import dotenv from "dotenv";

dotenv.config();

const startServer = async () => {
  const app = express();
  const PORT = 5000;
  App(app);

  app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`);
  });
};

startServer();