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

//function to upload a file to the S3 bucket

router.post('/presigned-url', (req, res) => {
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

// Route to list files in S3 bucket
router.get('/list-files', async (req, res) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        const files = data.Contents.map(item => ({
            fileName: item.Key,
            lastModified: item.LastModified,
            size: item.Size
        }));

        res.json(files);
    } catch (err) {
        console.error("Error listing files:", err);
        res.status(500).json({ error: "Error retrieving files from S3" });
    }
});


module.exports = router; 