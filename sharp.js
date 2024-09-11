// const axios = require('axios');
// const sharp = require('sharp');

// async function fetchImage(url) {
//     const response = await axios.get(url, { responseType: 'arraybuffer' });
//     return Buffer.from(response.data, 'binary');
// }

// var imageCompare = "https://media-gallery.s3.eu-west-1.wasabisys.com/64d9fd34d6904fcd1b8f869f/3612a5cb-e20f-4b6e-866f-989ed9146d46.jpeg";

// async function extractMetadata(imageCompare) {
//     var data = [

//     ]
//     try {
//         const imageBuffer1 = await fetchImage('https://media-gallery.s3.eu-west-1.wasabisys.com/64d9fd34d6904fcd1b8f869f/432fdc03-0348-4101-bec4-9a8e9cac6c83.jpeg');
//         const imageBuffer2 = await fetchImage('https://media-gallery.s3.eu-west-1.wasabisys.com/64d9fd34d6904fcd1b8f869f/44a48235-4581-49af-8f10-793bd72c03b6.jpeg');
//         const imageBuffer3 = await fetchImage('https://media-gallery.s3.eu-west-1.wasabisys.com/64d9fd34d6904fcd1b8f869f/e3bdef97-dac0-4e48-832e-22a7dcba9db5.jpeg');
//         const imageBuffer4 = await fetchImage('https://media-gallery.s3.eu-west-1.wasabisys.com/64d9fd34d6904fcd1b8f869f/ff3e8352-107d-42ee-982a-7fb626b7cb34.jpeg');
//         const imageBuffer5 = await fetchImage(imageCompare)

//         const metadata1 = await sharp(imageBuffer1).metadata();
//         const metadata2 = await sharp(imageBuffer2).metadata();
//         const metadata3 = await sharp(imageBuffer3).metadata();
//         const metadata4 = await sharp(imageBuffer4).metadata();
//         const metadata5 = await sharp(imageBuffer5).metadata();
//         // const metadata2 = await sharp('Images/w1.jpeg').metadata();

//         console.log(metadata1); // Extracted metadata
//         console.log(metadata2); // Extracted metadata
//         for (i = 1; i <= 4; i++) {
//             if (JSON.stringify(`metadata${i}`) === JSON.stringify(metadata5)) {
//                 console.log("same");
//                 console.log(metadata5)
//             } else {
//                 console.log("diff");
//                 console.log("No image")
//             }
//         }
//     } catch (err) {
//         console.error('Error fetching metadata:', err);
//     }
// }

// extractMetadata(imageCompare);



const axios = require('axios');
const sharp = require('sharp');

async function fetchImage(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

var imageCompare = "https://media-gallery.s3.eu-west-1.wasabisys.com/64d9fd34d6904fcd1b8f869f/3612a5cb-e20f-4b6e-866f-989ed9146d46.jpeg";

async function extractMetadata(imageCompare) {
    try {
        // Fetch image buffers
        const imageURLs = [
            'https://media-gallery.s3.eu-west-1.wasabisys.com/64d9fd34d6904fcd1b8f869f/432fdc03-0348-4101-bec4-9a8e9cac6c83.jpeg',
            'https://media-gallery.s3.eu-west-1.wasabisys.com/64d9fd34d6904fcd1b8f869f/44a48235-4581-49af-8f10-793bd72c03b6.jpeg',
            'https://media-gallery.s3.eu-west-1.wasabisys.com/64d9fd34d6904fcd1b8f869f/e3bdef97-dac0-4e48-832e-22a7dcba9db5.jpeg',
            'https://media-gallery.s3.eu-west-1.wasabisys.com/64d9fd34d6904fcd1b8f869f/ff3e8352-107d-42ee-982a-7fb626b7cb34.jpeg'
        ];

        const imageBuffers = await Promise.all(imageURLs.map(fetchImage));
        const imageCompareBuffer = await fetchImage(imageCompare);

        // Extract metadata
        const metadataList = await Promise.all(imageBuffers.map(buffer => sharp(buffer).metadata()));
        const metadataCompare = await sharp(imageCompareBuffer).metadata();

        // Compare metadata
        metadataList.forEach((metadata, index) => {
            if (JSON.stringify(metadata) === JSON.stringify(metadataCompare)) {
                // console.log(`Image ${index + 1} is the same as the compare image.`);
                console.log(metadataCompare);
            } else {
                // console.log(`Image ${index + 1} is different.`);
            }
        });
    } catch (err) {
        console.error('Error fetching metadata:', err);
    }
}

// module.exports = extractMetadata();
// extractMetadata(imageCompare);
