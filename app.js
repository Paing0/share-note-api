import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import noteRoutes from "./routes/note.js";

import "dotenv/config";

const app = express();

app.use(bodyParser.json());

app.use(noteRoutes);

// Database and server connection
const startServer = async () => {
  try {
    // Await the connection to MongoDB
    await mongoose.connect(process.env.MONGO_URL);

    // Start the server once connected
    app.listen(8000, () => {
      console.log(
        "Connected to the database and server is running on port 8000",
      );
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

startServer();
