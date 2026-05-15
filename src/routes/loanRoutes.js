import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();


router.use(authMiddleware);
router.use(adminOnly);

router.post("/request", authMiddleware, createLoan);

router.post("/:id/approve", authMiddleware, adminOnly, approveLoan);

router.get("/my-loans", authMiddleware, getUserLoans);


