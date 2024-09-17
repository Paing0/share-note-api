import express from "express";
import { body } from "express-validator";
import * as noteController from "../controllers/note.js";

const router = express.Router();

// GET /notes
router.get("/notes", noteController.getNotes);

// POST /create
router.post(
  "/create",
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
router.delete("/delete/:id", noteController.deleteNote);

// GET /edit/:id
router.get("/edit/:id", noteController.getOldNote);

// PATCH /edit
router.patch("/edit", noteController.updateNote);

export default router;
