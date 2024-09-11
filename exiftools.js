const fs = require('fs');
const { ExiftoolProcess } = require('node-exiftool');

const exiftool = new ExiftoolProcess();

async function getFileMetadata(filePath) {
  const fileName = filePath.split('/').pop(); // Extracts the file name from the path

  try {
    await exiftool.open();
    
    // Use the ExifTool to extract all metadata available in the file
    const metadata = await exiftool.readMetadata(filePath, ['-all']);
    
    await exiftool.close();

    return { fileName, metadata: metadata.data }; // Include the file name along with metadata
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
}

// Test the function with an image file
getFileMetadata('Images/1725873197931.jpg')
  .then(result => {
    if (result) {
      console.log('File Name:', result.fileName);
      console.log('Metadata:', result.metadata); // Outputs the metadata of the file
    }
  });
