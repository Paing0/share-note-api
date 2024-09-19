import express from "express";
import { body } from "express-validator";
import * as authController from "../controllers/auth.js";
import User from "../models/user.js";

const router = express.Router();

// POST /register
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter an valid email")
      .normalizeEmail()
      .custom(async (value) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          throw new Error("Email address is already in use");
        }
      }),

    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters.")
      .isLength({ max: 10 })
      .withMessage("Username must not be over 10 characters.")
      .custom(async (value) => {
        const userDoc = await User.findOne({ username: value });
        if (userDoc) {
          throw new Error("Username is already in use");
        }
      }),

    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Username must be at least 4 characters."),
  ],
  authController.register,
);

export default router;
