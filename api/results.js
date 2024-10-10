const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../utils/db');
const auth = require('../middleware/auth');
const Result = require('../models/Result');

// Get results
router.get('/', auth, async (req, res) => {
  await connectToDatabase();
  try {
    const results = await Result.find({ user: req.user.id }).sort({ date: -1 });
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create result
router.post('/', auth, async (req, res) => {
  await connectToDatabase();
  try {
    const newResult = new Result({
      user: req.user.id,
      data: req.body.data
    });
    const result = await newResult.save();
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = async (req, res) => {
  console.log('Received request:', req.method, req.url);
  
  try {
    await connectToDatabase();
    console.log('Database connected');

    if (req.method === 'GET') {
      await getResults(req, res);
    } else if (req.method === 'POST') {
      await createResult(req, res);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Unhandled error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

async function getResults(req, res) {
  try {
    // Implement auth check here if needed
    const results = await Result.find().sort({ date: -1 });
    console.log('Fetched results:', results.length);
    res.json(results);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ message: 'Error fetching results', error: err.message });
  }
}

async function createResult(req, res) {
  try {
    // Implement auth check here if needed
    const newResult = new Result(req.body);
    const result = await newResult.save();
    console.log('Saved result:', result);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error saving result:', err);
    res.status(500).json({ message: 'Error saving result', error: err.message });
  }
}
