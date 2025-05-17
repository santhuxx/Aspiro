// backend/routes/jobMatch.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const { futureJob, education, skills, experience } = req.body;

  // Validate input
  if (!futureJob || !education || !skills || !experience) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
      {
        contents: [
          {
            parts: [
              {
                text: `Act as a career advisor. Given a user's desired job, education, skills, and experience, determine if the job is a good match (provide a match score from 0-100) and suggest up to two alternative job roles if the match is below 80. Provide a brief explanation. Return JSON with fields: { desiredJob, matchScore, explanation, suggestions (optional array) }.\nDesired Job: ${futureJob}\nEducation: ${JSON.stringify(education)}\nSkills: ${JSON.stringify(skills)}\nExperience: ${JSON.stringify(experience)}`
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'AIzaSyCk_vpgdzjOAOhozrJZXb9s3nsn1DUloqA'
        }
      }
    );

    // Parse Gemini response (adjust based on actual response structure)
    const resultText = response.data.candidates[0].content.parts[0].text;
    let result;
    try {
      result = JSON.parse(resultText); // Assumes Gemini returns JSON string
    } catch {
      result = {
        desiredJob: futureJob,
        matchScore: 70,
        explanation: resultText || 'Analysis completed.',
        suggestions: ['Alternative Job 1', 'Alternative Job 2']
      };
    }

    res.json(result);
  } catch (error) {
    console.error('Error processing job match:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    res.status(500).json({ error: 'Failed to process job match', details: error.message });
  }
});

module.exports = router;