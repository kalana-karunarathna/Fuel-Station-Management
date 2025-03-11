require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const URL = process.env.MONGODB_URL;

if (!URL) {
  console.error("Error: MONGODB_URL is not defined. Please check your .env file.");
  process.exit(1);
}

mongoose
  .connect(URL) // No additional options required for the latest driver
  .then(() => {
    console.log("MongoDB connection successful!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });


 
http://Localhost:8000/student

// app.use("/student",studentRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});

