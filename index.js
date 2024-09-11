require('dotenv').config();
const express = require("express");
const app = express();
const multer = require('multer');
const path = require("path");
const uploadToCloudinary = require('./utils/cloudinary');
app.use(express.json());

// Uncomment the code below if you need file upload functionality
/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images');
    },
    filename: (req, file, cb) => {
        const newFileName = Date.now() + path.extname(file.originalname);
        cb(null, newFileName);
    }
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    res.json({ message: 'Image uploaded', fileName: file.filename });
});
*/

app.post("/up_c", (req, res) => {
    // Replace with actual URL from query or body if needed
    uploadToCloudinary("Images/c1.jpg");
    console.log("Uploaded successfully");
    res.json({ message: 'Uploaded successfully' });
});

const axios = require('axios');
const sharp = require('sharp');

async function fetchImage(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

async function extractMetadata(imageCompare, imageURLS, res) {
    try {
        // Validate input
        if (!Array.isArray(imageURLS) || !imageCompare) {
            return res.status(400).json({ error: 'Invalid input. Ensure imageCompare and imageURLS are provided.' });
        }

        // Fetch image buffers
        const imageBuffers = await Promise.all(imageURLS.map(fetchImage));
        const imageCompareBuffer = await fetchImage(imageCompare);

        // Extract metadata
        const metadataList = await Promise.all(imageBuffers.map(buffer => sharp(buffer).metadata()));
        const metadataCompare = await sharp(imageCompareBuffer).metadata();

        // Compare metadata
        let isSame = false;
        var position;
        metadataList.forEach((metadata, index) => {
            if (JSON.stringify(metadata) === JSON.stringify(metadataCompare)) {
                isSame = true;
                console.log(`Image ${index + 1} is the same as the compare image.`);
                position = index+1;
            }
        });

        if (isSame) {
            res.json({ metaData: metadataCompare, url:imageURLS[position]});
        } else {
            res.json({ message: "All images are different from the target image." });
        }
    } catch (err) {
        console.error('Error fetching metadata:', err);
        res.status(500).json({ error: "Error fetching metadata." });
    }
}

app.post("/compare", (req, res) => {
    const imageCompare = req.query.target;
    const imageURLS = req.body.imageURLS; // Ensure body contains imageURLS array

    extractMetadata(imageCompare, imageURLS, res);
});

app.listen(8000, () => {
    console.log('Server running on port 8000');
});


// const axios = require('axios');
// const sharp = require('sharp');
// const express = require("express")
// const app = express();
// app.use(express.json());

// async function fetchImage(url) {
//     try {
//         const response = await axios.get(url, { responseType: 'arraybuffer' });
//         return Buffer.from(response.data, 'binary');
//     } catch (error) {
//         console.error(`Error fetching image from ${url}:`, error.message);
//         throw error;
//     }
// }

// async function extractMetadata(imageCompare, imageURLS) {
//     if (!Array.isArray(imageURLS) || !imageCompare) {
//         throw new Error('Invalid input. Ensure imageCompare and imageURLS are provided.');
//     }

//     const compareBuffer = await fetchImage(imageCompare);
//     const compareMetadata = await sharp(compareBuffer).metadata();

//     const results = await Promise.all(imageURLS.map(async (url, index) => {
//         try {
//             const buffer = await fetchImage(url);
//             const metadata = await sharp(buffer).metadata();
            
//             // Compare relevant metadata properties
//             const isSimilar = ['width', 'height', 'format', 'space'].every(
//                 prop => metadata[prop] === compareMetadata[prop]
//             );

//             return { url, isSimilar, index };
//         } catch (error) {
//             console.error(`Error processing image ${index + 1}:`, error.message);
//             return { url, error: error.message, index };
//         }
//     }));

//     const similarImages = results.filter(result => result.isSimilar);
//     const hasMatch = similarImages.length > 0;

//     return { hasMatch, similarImages, allResults: results };
// }

// app.post("/compare", async (req, res) => {
//     const imageCompare = req.query.target;
//     const imageURLS = req.body.imageURLS;

//     try {
//         const result = await extractMetadata(imageCompare, imageURLS);
        
//         if (result.hasMatch) {
//             res.json({
//                 message: "One or more images are similar to the target image.",
//                 similarImages: result.similarImages,
//                 allResults: result.allResults
//             });
//         } else {
//             res.json({
//                 message: "All images are different from the target image.",
//                 allResults: result.allResults
//             });
//         }
//     } catch (error) {
//         console.error('Error in comparison:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(8000, () => {
//     console.log('Server running on port 8000');
// });