// const { v2 } = require("cloudinary");

// const fs = require("fs");

// v2.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET_KEY
// });


//  const uploadToCloudinary = async (file) => {
//     try {

//         if (!file) return;
//         // file upload
//         const response = await v2.uploader(file, {
//             resource_type: "auto"
//         })
//         console.log("file uploaded",response.url);
//         return response;

//     } catch (err) {
//       fs.unlinkSync(file);
//   return null;
//     }
// }

// module.exports = uploadToCloudinary;.


// const { v2 } = require("cloudinary");
// const fs = require("fs");

// v2.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET_KEY
// });

// const uploadToCloudinary = async (file) => {
//     try {
//         if (!file) return null;

//         let response;

//         // Check if the file is a path or a buffer
//         if (typeof file === 'string') {
//             // If `file` is a file path
//             response = await v2.uploader.upload(file, {
//                 resource_type: "auto"
//             });
//         } else {
//             // If `file` is a buffer or other type, use `upload_stream`
//             response = await new Promise((resolve, reject) => {
//                 v2.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
//                     if (error) {
//                         reject(error);
//                     } else {
//                         resolve(result);
//                     }
//                 }).end(file);
//             });
//         }

//         console.log("File uploaded", response.url);
//         return response;

//     } catch (err) {
//         console.error('Error uploading file:', err);
//         if (typeof file === 'string') {
//             // If `file` is a path, delete it
//             try {
//                 fs.unlinkSync(file);
//             } catch (deleteError) {
//                 console.error('Error deleting file:', deleteError);
//             }
//         }
//         return null;
//     }
// }

// module.exports = uploadToCloudinary;

const { v2 } = require("cloudinary");
const fs = require("fs");
const path = require("path");

v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadToCloudinary = async (file) => {
    try {
        if (!file) return null;

        let response;

        // Check if the file is a path or a buffer
        if (typeof file === 'string') {
            // If `file` is a file path
            const fileName = path.basename(file, path.extname(file)); // Extract file name without extension
            const fileExtension = path.extname(file).slice(1); // Extract file extension (remove leading dot)

            response = await v2.uploader.upload(file, {
                resource_type: "auto",
                public_id: fileName, // Set the public ID to the original file name
                overwrite: true // Optional: set to true to overwrite existing files with the same name
            });
        } else {
            // If `file` is a buffer or other type, use `upload_stream`
            const fileName = 'upload_' + Date.now(); // Use a unique name for the buffer upload

            response = await new Promise((resolve, reject) => {
                v2.uploader.upload_stream({
                    resource_type: "auto",
                    public_id: fileName // Use a unique name for the buffer upload
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }).end(file);
            });
        }

        console.log("File uploaded", response.url);
        fs.unlinkSync(file);
        return response;

    } catch (err) {
        console.error('Error uploading file:', err);
        if (typeof file === 'string') {
            // If `file` is a path, delete it
            try {
                fs.unlinkSync(file);
            } catch (deleteError) {
                console.error('Error deleting file:', deleteError);
            }
        }
        return null;
    }
}

module.exports = uploadToCloudinary;

