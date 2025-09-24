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
app.use(express.static("public")); // serve frontend + extracted files

const upload = multer({ dest: "uploads/" });

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = req.file.path;
  const extractDir = `public/extracted/${req.file.filename}`;

  try {
    // Extract into public folder so frontend can load models
    const zip = new AdmZip(filePath);
    zip.extractAllTo(extractDir, true);
    fs.unlinkSync(filePath);

    // Find first .glb or .gltf file
    let modelFile = null;
    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          const nested = walkDir(fullPath);
          if (nested) return nested;
        } else if (file.endsWith(".glb") || file.endsWith(".gltf")) {
          return fullPath;
        }
      }
      return null;
    };

    modelFile = walkDir(extractDir);

    // Convert full path -> relative URL
    let modelPath = null;
    if (modelFile) {
      modelPath = "/" + path.relative("public", modelFile).replace(/\\/g, "/");
    }

    res.json({
      message: "File uploaded and extracted successfully!",
      modelPath,
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
