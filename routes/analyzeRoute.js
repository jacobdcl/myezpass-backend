const express = require('express');
const { Configuration, OpenAIApi } = require("openai");

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/analyze', async (req, res) => {
  try {
    const { data } = req.body;
    
    const prompt = `Analyze this EZPass data and provide a short, personalized insight:
      ${JSON.stringify(data)}`;

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 100
    });

    res.json({ message: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error fetching AI analysis:', error);
    res.status(500).json({ error: 'Unable to generate AI analysis at this time.' });
  }
});

module.exports = router;

