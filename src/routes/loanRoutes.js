import express from "express";
import { request_loan, getMyLoans, updateLoanStatus, view_record,repayLoan } from "../controllers/loanController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnlyMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/request", authMiddleware, request_loan);
router.get("/my_loans",authMiddleware, getMyLoans);
router.patch("/:loanId/status", authMiddleware, adminOnlyMiddleware,updateLoanStatus);
router.get("/all_loans", authMiddleware,adminOnlyMiddleware,view_record);
router.post("/:loanId/pay", authMiddleware,repayLoan);


export default router;