import { validationResult } from "express-validator";

import Note from "../models/note.js";
import { unlink } from "../utils/unlink.js";

// GET /notes
export const getNotes = async (req, res) => {
  const currentPage = req.query.page || 1;
  const perPage = 6;
  let totalNotes;
  let totalPages;
  try {
    totalNotes = await Note.find().countDocuments();

    totalPages = Math.ceil(totalNotes / perPage);
    // Fetch and sort notes from db by latest (newest first)
    const notes = await Note.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    if (!notes) {
      return res.status(404).json({
        message: "Notes not found",
      });
    }

    res.status(200).json({ notes, totalNotes, totalPages });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve notes",
      error: error.message,
    });
  }
};

// POST /notes
export const createNote = async (req, res) => {
  // Get errors from validationResult which is checked in routes
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errorMessages: errors.array(),
    });
  }

  const { title, content } = req.body;
  const cover_image = req.file;

  try {
    await Note.create({
      title,
      content,
      cover_image: cover_image ? cover_image.path : "",
    });

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
export const getNote = async (req, res) => {
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
export const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // delete cover_image
    if (note.cover_image) {
      unlink(note.cover_image);
    }

    await Note.findByIdAndDelete(id);

    res.status(204).json();
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete note",
      error: error.message,
    });
  }
};

// GET /edit/:id
export const getOldNote = async (req, res) => {
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
export const updateNote = async (req, res) => {
  const { note_id, title, content } = req.body;
  const cover_image = req.file;

  try {
    // Find the note by ID
    const note = await Note.findById(note_id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Update the note's fields
    note.title = title;
    note.content = content;
    // If there's a new cover image, delete the old one
    if (cover_image) {
      unlink(note.cover_image);
      note.cover_image = cover_image.path;
    }

    // Save the updated note
    await note.save();

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
