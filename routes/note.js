import express from "express";
import { body } from "express-validator";
import * as noteController from "../controllers/note.js";
import authMiddleware from "../middlewares/isAuth.js";

const router = express.Router();

// GET /notes
router.get("/notes", noteController.getNotes);

// POST /create
router.post(
  "/create",
  authMiddleware,
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters.")
      .isLength({ max: 100 })
      .withMessage("Title must not be over 100 characters."),
    body("content")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Content must be at least 3 characters."),
  ],
  noteController.createNote,
);

// GET /notes/:id
router.get("/notes/:id", noteController.getNote);

// DELETE /delete/:id
router.delete("/delete/:id", authMiddleware, noteController.deleteNote);

// GET /edit/:id
router.get("/edit/:id", authMiddleware, noteController.getOldNote);

// PATCH /edit
router.patch("/edit", authMiddleware, noteController.updateNote);

export default router;
