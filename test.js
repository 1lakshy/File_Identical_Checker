const express = require('express');
const url = require('url');
const path = require('path');

const app = express();

// API endpoint to extract the image file name from the URL
app.get('/get-filename', (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).json({ error: 'URL parameter is missing' });
  }

  try {
    // Parse the URL and get the path
    const parsedUrl = url.parse(imageUrl);
    const fileName = path.basename(parsedUrl.pathname); // Extract the file name

    res.json({ fileName });
  } catch (error) {
    res.status(500).json({ error: 'Failed to extract file name' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
