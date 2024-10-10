const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Result = require('../models/Result');

// Save result
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received save request:', req.body);
    const newResult = new Result({
      user: req.user.id,
      data: req.body.data
    });

    const result = await newResult.save();
    console.log('Saved result:', result);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error saving result:', err);
    res.status(500).json({ message: 'Error saving result', error: err.message });
  }
});

// Get user's results
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching results for user:', req.user.id);
    const results = await Result.find({ user: req.user.id }).sort({ date: -1 });
    console.log('Fetched results:', results.length);
    res.json(results);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ message: 'Error fetching results', error: err.message });
  }
});

// Delete a result
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Make sure user owns the result
    if (result.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: 'Result removed' });
  } catch (err) {
    console.error('Error deleting result:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;