const fs = require('fs');
const ExifImage = require('exif').ExifImage;

try {
    new ExifImage({ image: 'Images/c1.jpg' }, function (error, exifData) {
        if (error)
            console.log('Error: ' + error.message);
        else
            console.log('EXIF data: ', exifData); // Extracted metadata
    });
} catch (error) {
    console.log('Error: ' + error.message);
}
