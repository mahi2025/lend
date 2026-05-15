import pool from "../db/Database.js";

export const request_loan = async (req, res) => {
  try {
    const { amount, duration_months } = req.body;

    const interestRate = 10;

    const totalAmount = amount + (amount * interestRate) / 100;

    const loan = await pool.query(
      `
      INSERT INTO loans
      (
        user_id,
        amount,
        interest_rate,
        total_amount,
        remaining_balance,
        duration_months
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        req.user.id,
        amount,
        interestRate,
        totalAmount,
        totalAmount,
        duration_months,
      ],
    );

    res.status(201).json(loan.rows[0]);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getMyLoans = async (req, res) => {
  try {
    const loans = await pool.query(
      `
      SELECT *
      FROM loans
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id],
    );

    res.json(loans.rows);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const updateLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;

    const { status } = req.body;

    const allowedStatus = ["approved", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const loan = await pool.query(
      `
      SELECT *
      FROM loans
      WHERE id = $1
      `,
      [loanId],
    );

    if (loan.rows.length === 0) {
      return res.status(404).json({
        message: "Loan not found",
      });
    }

    if (loan.rows[0].status !== "pending") {
      return res.status(400).json({
        message: "Loan already processed",
      });
    }

    const updatedLoan = await pool.query(
      `
      UPDATE loans
      SET status = 'approved'
      WHERE id = $1
      RETURNING *
      `,
      [status, loanId],
    );

    res.json({
      message: `Loan ${status} successfully`,
      loan: updatedLoan.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const view_record = async (req, res) => {
  try {
    const loans = await pool.query(
      `
      SELECT *
      FROM loans
      ORDER BY created_at DESC
      `,
    );

    res.json(loans.rows);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const repayLoan = async (req, res) => {

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { loanId } = req.params;

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Invalid payment amount",
      });
    }

    const loanResult = await pool.query(
      `
      SELECT *
      FROM loans
      WHERE id = $1
      `,
      [loanId],
    );

    if (loanResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Loan not found",
      });
    }

    const loan = loanResult.rows[0];

    if (loan.user_id !== req.user.id) {
      await client.query("ROLLBACK");

      return res.status(403).json({
        message: "Unauthorized user",
      });
    }

    if (loan.status !== "approved") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Loan is not approved",
      });
    }

    // overpayment prevention
    if (amount > loan.remaining_balance) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Payment exceeds the balance",
      });
    }

    await client.query(
      `
      INSERT INTO repayments
      (loan_id, amount)
      VALUES ($1, $2)
      `,
      [loanId, amount],
    );

    // Calculate new balance
    const newBalance = loan.remaining_balance - amount;

    // Give paid status
    const newStatus = newBalance === 0 ? "paid" : "approved";

    const updatedLoan = await client.query(
      `
      UPDATE loans
      SET
        remaining_balance = $1,
        status = $2
      WHERE id = $3
      RETURNING *
      `,
      [newBalance, newStatus, loanId],
    );

    await client.query("COMMIT");

    res.json({
      message: "Payment successfuly paid",
      loan: updatedLoan.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");

    res.status(500).json({
      message: err.message,
    });
  } finally {
    client.release();
  }
};