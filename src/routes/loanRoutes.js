import express from "express";

const router = express.Router();


router.get("loans/request", loanRequest);
router.get("loans/reject", loanReject);
router.post("loans/pay", loanPay);

