const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { askGroq } = require('../services/groqService');

// GET /api/ai/recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const reply = await askGroq(
      'Give me exactly 3 content strategy tips for a YouTube creator. Format as JSON array with keys: title, description, priority (high/medium/low)',
      'You are an expert content strategy advisor. Always respond with valid JSON only, no extra text.'
    );
    // Clean potential markdown blocks from AI response
    const cleanReply = reply.replace(/```json/gi, '').replace(/```/g, '').trim();
    const tips = JSON.parse(cleanReply);
    res.json({ success: true, recommendations: tips });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/ai/posting-time
router.get('/posting-time', auth, async (req, res) => {
  try {
    const reply = await askGroq(
      'What are the best times to post on YouTube, Instagram, and TikTok for maximum views? Return a JSON object EXACTLY like this: { "youtube": { "bestDay": "...", "bestHour": "...", "timezone": "IST", "engagementLift": "..." }, "instagram": { "bestDay": "...", "bestHour": "...", "timezone": "IST", "engagementLift": "..." }, "tiktok": { "bestDay": "...", "bestHour": "...", "timezone": "IST", "engagementLift": "..." } }',
      'You are an expert social media analyst. Always respond with valid JSON only, no extra text.'
    );
    // Clean potential markdown blocks from AI response
    const cleanReply = reply.replace(/```json/gi, '').replace(/```/g, '').trim();
    const timingData = JSON.parse(cleanReply);
    res.json({ success: true, data: timingData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/ai/chat
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, messages } = req.body;
    
    // Support both { message: "hi" } from our tests and { messages: [{text: "hi"}] } from the React frontend
    let userMessage = message;
    if (!userMessage && messages && messages.length > 0) {
      userMessage = messages[messages.length - 1].text || messages[messages.length - 1].content || '';
    }

    const reply = await askGroq(
      userMessage,
      'You are a helpful assistant for content creators. Give short, practical advice about growing on YouTube and Instagram.'
    );
    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;