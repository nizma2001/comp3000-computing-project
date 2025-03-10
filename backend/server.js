//creating express server
console.log("App started");

const express = require("express");  //import express
const AWS = require('aws-sdk');
const cors = require("cors");

console.log("Still working");

// eslint-disable-next-line no-unused-vars
const dotenv = require("dotenv").config({ path: '../.env' }); 
const path = require('path'); // For resolving file paths
console.log("env file imported");
console.log(process.env.TEST_ENV); // Debugging step //access variables defined in .env

const authRoutes = require("./routes/authRoutes"); //import the API routes
const userRoutes = require("./routes/userRoute"); //import user route
const fileRoutes = require("./routes/fileRoute"); //import file routes
console.log("routes directory correct");

const dbConnect = require("./config/dbConnect");



dbConnect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit with failure
  });


const app = express();

// eslint-disable-next-line no-unused-vars
const s3 = new AWS.S3(); 
//Middleware

app.use(express.json());  //get JSON data
//app.use(cors());

app.use(cors({
    origin: 'http://localhost:7002',  // React app URL
    credentials: true                // Enable cookies if needed
  }));




//Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Example route to test the static file
//app.get('/', (req, res) => {
 //   res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
//});



//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);



//Start the server
const PORT = process.env.PORT || 7002; //process, to get value from env file
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})