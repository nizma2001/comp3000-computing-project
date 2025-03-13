const express = require('express');
const AWS = require('aws-sdk');

const router = express.Router();

// Configure AWS SDK

console.log("fileRoute.js is loaded!");


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

console.log("Bucket Name:", process.env.AWS_S3_BUCKET);

//function to upload a file to the S3 bucket

router.post('/presigned-url', (req, res) => {  //pre-signed url to POST file to S3 bucket 
    const { fileName, fileType } = req.body;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Expires: 120, // URL expiry limit - 120 seconds..
        ContentType: fileType,
    };

    s3.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
            console.error(err);
            alert(err);
            return res.status(500).json({ error: 'Error generating pre-signed URL' });
        }

        res.json({ presignedUrl: url });
        console.log("all ok");
       
    });
});


//function to list all files in the S3 bucket


router.get('/list-files', async (req, res) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        const files = data.Contents.map(item => ({
            fileName: item.Key.split('/').pop(),  // Extract the file name from the full path
            fileKey: item.Key, 
            lastModified: item.LastModified,
            size: item.Size
        }));

        res.json(files);
    } catch (err) {
        console.error("Error listing files:", err);
        res.status(500).json({ error: "Error retrieving files from S3" });
    }
});


//function to delete


router.delete('/delete/:filename', (req, res) => {
 
    const fileName = req.params.filename;
    console.log("Deleting file:", fileName); //debug step
  
    // Check if user is an admin 
   // if (!req.user || req.user.role !== 'admin') {
    //  return res.status(403).send('Access Denied');
   // }
  console.log("code reaches this point");
    const params = {
      Bucket:  process.env.AWS_S3_BUCKET,
      Key: fileName,
    
    };
    
    console.log("Delete request params:", params);
  
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error deleting file');
      }
  
      res.send('File deleted successfully');
    });
  });

  //function to download using pre-signed url

  router.get('/download/:filename', (req, res) => {
    const fileName = req.params.filename;
  
    console.log("Downloading file:", fileName);  // Debug step
  
    const params = {
      Bucket: 'your-bucket-name', // Replace with your S3 bucket name
      Key: fileName,
      Expires: 60 // URL will expire in 60 seconds (can adjust as needed)
    };
  
    // Generate a pre-signed URL for downloading the file
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error generating pre-signed URL');
      }
      
      // Send the pre-signed URL as the response
      res.json({ url });
    });
});
  
module.exports = router; 