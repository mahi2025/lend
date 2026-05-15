import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js"
import loanRoutes from "./routes/loanRoutes.js";


const App = (app) => {
  app.use(cors());
  app.use(express.json());

 app.use("/users", authRoutes);
 app.use("/loans", loanRoutes);
 

  app.get("/", (req, res) => {
    res.json({
      message: "Running",
    });
  });
  
};

export default App;