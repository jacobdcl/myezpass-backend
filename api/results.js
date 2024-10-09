const { connectToDatabase } = require('../utils/db');
const auth = require('../middleware/auth');
const Result = require('../models/Result');

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    await getResults(req, res);
  } else if (req.method === 'POST') {
    await saveResult(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getResults(req, res) {
  await connectToDatabase();
  await auth(req, res, async () => {
    try {
      const results = await Result.find({ user: req.user.id }).sort({ date: -1 });
      res.json(results);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
}

async function saveResult(req, res) {
  await connectToDatabase();
  await auth(req, res, async () => {
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
}
