import pool from "../db/Database.js";
import bcrypt from "bcrypt";
import {generateToken} from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await pool.query(
      `INSERT INTO users (fullname, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, fullname, email, role`,
      [fullname, email, hashedPassword],
    );

    res.status(201).json(user.rows[0]);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!valid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user.rows[0]);

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};