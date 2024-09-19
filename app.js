import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/note.js";

const app = express();

const storageConfiguration = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads");
  },
  filename: (_req, file, cb) => {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, suffix + "-" + file.originalname);
  },
});

const filterConfiguration = (_req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, undefined);
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());

app.use(
  multer({
    storage: storageConfiguration,
    fileFilter: filterConfiguration,
  }).single("cover_image"),
);

app.use(cors());

app.use(noteRoutes);
app.use(authRoutes);

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
