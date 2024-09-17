import { validationResult } from "express-validator";

import Note from "../models/note.js";

// GET /notes
export const getNotes = async (req, res, next) => {
  try {
    // Fetch and sort notes from db by latest note
    const notes = await Note.find().sort({ createdAt: -1 });

    if (!notes) {
      return res.status(404).json({
        message: "Notes not found",
      });
    }

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve notes",
      error: error.message,
    });
  }
};

// POST /notes
export const createNote = async (req, res, next) => {
  // Get errors from validationResult which is checked in routes
  const errors = validationResult(req);
  const { title, content } = req.body;

  if (!errors.isEmpty()) {
    return res.status(500).json({
      message: "Validation failed",
      errorMessages: errors.array(),
    });
  }

  try {
    await Note.create({ title, content });

    res.status(201).json({
      message: "Note created",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create note",
      error: error.message,
    });
  }
};

// GET /notes/:id
export const getNote = async (req, res, next) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve note",
      error: error.message,
    });
  }
};

// DELETE /notes/:id
export const deleteNote = async (req, res, next) => {
  const { id } = req.params;
  try {
    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(204).json({});
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete note",
      error: error.message,
    });
  }
};

// GET /edit/:id
export const getOldNote = async (req, res, next) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get old note",
      error: error.message,
    });
  }
};

// PATCH /edit
export const updateNote = async (req, res, next) => {
  const { note_id, title, content } = req.body;
  try {
    const note = await Note.findByIdAndUpdate(
      note_id,
      { title, content },
      { new: true },
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note updated",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update old note",
      error: error.message,
    });
  }
};
