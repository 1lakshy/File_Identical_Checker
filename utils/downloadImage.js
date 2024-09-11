const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Download an image from a URL and save it to a local file
 * @param {string} url - The URL of the image
 * @param {string} outputPath - The local path where the image will be saved
 */
async function downloadImage(url, outputPath) {
    try {
        // Fetch the image
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        // Create a write stream
        const writer = fs.createWriteStream(outputPath);

        // Pipe the response data to the file
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading the image:', error);
        throw error;
    }
}

const imageUrl = 'https://media-gallery.s3.eu-west-1.wasabisys.com/64d9fd34d6904fcd1b8f869f/8ca0d236-4618-4c77-88ac-76a8320639d7.jpeg'; 
const outputPath = path.join(__dirname, '../Images/downloaded_image.jpg'); 
downloadImage(imageUrl, outputPath)
    .then(() => {
        console.log('Image downloaded successfully');
    })
    .catch((error) => {
        console.error('Failed to download the image:', error);
    });
