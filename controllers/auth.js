import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

import User from "../models/user.js";

// POST /register
export const register = async (req, res) => {
  // Get errors from validationResult which is checked in routes
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errorMessages: errors.array(),
    });
  }

  const { email, password, username } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashPassword,
      username,
    });

    res.status(201).json({ message: "User created.", userId: newUser._id });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Failed to register",
      error: error.message,
    });
  }
};
