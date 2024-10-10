const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const uri = "mongodb+srv://jacobdcl:jacob611@myezpass.nns0l.mongodb.net/?retryWrites=true&w=majority&appName=myezpass";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Define your schemas and models here

// Your API routes will go here

const authRoutes = require('./routes/auth');
app.use(express.json());
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});