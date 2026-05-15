import express from "express";

const router = express.Router();

router.get("/test", test);
router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogout);

