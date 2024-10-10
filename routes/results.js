const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Result = require('../models/Result');

// Get results
router.get('/', auth, async (req, res) => {
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

module.exports = router;