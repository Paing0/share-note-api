import { model, Schema, SchemaTypes } from "mongoose";

// Define the schema for the 'Note' collection
const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    content: {
      type: String,
      required: true,
      minLength: 3,
    },
    author: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    cover_image: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically add 'createdAt' and 'updatedAt' fields
  },
);

// Create the model for the 'Note' schema
const noteModel = model("Note", noteSchema);

export default noteModel;
