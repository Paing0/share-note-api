import { model, Schema } from "mongoose";

// Define the schema for the 'User' collection
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minLength: 3,
    maxLength: 10,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
  },
});

// Create the model for the 'Note' schema
const userModel = model("User", userSchema);

export default userModel;
