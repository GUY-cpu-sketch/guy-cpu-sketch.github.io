const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/upload-avatar', upload.single('avatarZip'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // You can process the ZIP here (e.g., extract counts, thumbnails)
  // For now, we’ll return a fake example
  const exampleResponse = {
    avatars: [
      {
        name: req.file.originalname.replace('.zip',''),
        meshCount: 4,
        materialCount: 2,
        textureCount: 5,
        strength: 110,
        thumbnail: 'https://via.placeholder.com/96'
      }
    ]
  };

  res.json(exampleResponse);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
