const express = require('express');
const AWS = require('aws-sdk');
const axios = require('axios');
const router = express.Router();

// Configure AWS SDK

console.log("fileRoute.js is loaded!");


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    signatureVersion: 'v4'
});

const s3 = new AWS.S3();

console.log("Bucket Name:", process.env.AWS_S3_BUCKET);

//function to upload a file to the S3 bucket

router.post('/presigned-url', (req, res) => {  //pre-signed url to POST file to S3 bucket 
    const { fileName, fileType } = req.body;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Expires: 120, // setting a timelimit for the url
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

    console.log("Listing files with params:", params);

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

  router.get('/download/:filename', async (req, res) => {
    const fileName = req.params.filename;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Expires: 60
    };

    try {
        // generate pre-signed URL
        const presignedUrl = s3.getSignedUrl('getObject', params);
        const fileResponse = await axios.get(presignedUrl, { responseType: 'stream' });

        res.setHeader('Content-Type', fileResponse.headers['content-type']);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        fileResponse.data.pipe(res);

    } catch (err) {
        console.error('Error downloading file:', err.message);
        res.status(500).send('Error downloading file');
    }
});
  
module.exports = router; 