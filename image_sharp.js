const imageHash = require('image-hash');
const sharp = require('sharp');
const path = require('path');

// Helper function to compute the image hash
async function computeImageHash(imagePath) {
    // Use Sharp to process the image
    const imageBuffer = await sharp(imagePath).resize(64, 64).grayscale().toBuffer();
    
    // Write the buffer to a temporary file (since image-hash expects a file path)
    const tempFilePath = path.join(__dirname, 'temp_image.jpg');
    await sharp(imageBuffer).toFile(tempFilePath);
    
    // Compute the hash value
    return new Promise((resolve, reject) => {
        imageHash(tempFilePath, 8, true, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
}

// Helper function to compare two image hashes
async function compareImages(imagePath1, imagePath2) {
    try {
        const hash1 = await computeImageHash(imagePath1);
        const hash2 = await computeImageHash(imagePath2);
        return hash1 === hash2;
    } catch (err) {
        console.error('Error comparing images:', err);
        return false;
    }
}

// Usage example
const image1 = 'Images/c1.jpg';
const image2 = 'Images/c2.jpg';

compareImages(image1, image2).then(areSame => {
    if (areSame) {
        console.log('The images are the same.');
    } else {
        console.log('The images are different.');
    }
});
