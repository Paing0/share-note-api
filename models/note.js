import { model, Schema } from "mongoose";

// Define the schema for the 'Note' collection
const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    content: {
      type: String,
      required: true,
      minLength: 3,
    },
    author: {
      type: String,
      default: "Anonymous",
    },
  },
  {
    timestamps: true, // Automatically add 'createdAt' and 'updatedAt' fields
  },
);

// Create the model for the 'Note' schema
const noteModel = model("Note", noteSchema);

export default noteModel;
