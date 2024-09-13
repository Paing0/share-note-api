import { validationResult } from "express-validator";

export const getNotes = (req, res, next) => {
  console.log("GET /notes endpoint hit");
  noteController.getNotes(req, res, next);
};

export const createNote = (req, res, next) => {
  // get errors from validationResult which is checked in routes
  const errors = validationResult(req);
  const { title, content } = req.body;

  // if errors
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errorMessages: errors.array(),
    });
  }

  res.status(201).json({
    message: "Note created",
    data: {
      title,
      content,
    },
  });
};
