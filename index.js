import express from "express";
import multer from "multer";
import cors from "cors";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve frontend

const upload = multer({ dest: "uploads/" });

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = req.file.path;

  try {
    const zip = new AdmZip(filePath);
    const extractPath = `extracted/${req.file.filename}`;
    zip.extractAllTo(extractPath, true);
    fs.unlinkSync(filePath);

    // TODO: parse metadata & 3D file here
    res.json({
      message: "File uploaded and extracted successfully!",
      modelPath: `${extractPath}/avatar.glb`, // example
      stats: {
        strength: Math.floor(Math.random() * 100),
        speed: Math.floor(Math.random() * 100),
        agility: Math.floor(Math.random() * 100),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing file.");
  }
});

// Test endpoint
app.get("/api/ping", (req, res) => {
  res.send("Backend is running ✅");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
