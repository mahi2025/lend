import express from "express";
import cors from "cors";

const App = (app) => {
  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({
      message: "Running",
    });
  });
  
};

export default App;