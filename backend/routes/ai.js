const express = require('express');
const router  = require('express').Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Deal     = require('../models/Deal');

/**
 * AI routes — these return deterministic mock data that your ML model will replace.
 * The response shapes are stable; swap the body of each handler with real ML calls.
 */

// GET /api/ai/recommendations
router.get('/recommendations', auth, (req, res) => {
  res.json({
    success: true,
    data: {
      postingTime: {
        bestDay: 'Thursday',
        bestHour: '21:00',
        timezone: 'IST',
        reason: 'Historical data shows 42% higher engagement on Thursdays at 9 PM IST',
        hourlyScores: [
          { hour: '06:00', score: 28 }, { hour: '09:00', score: 62 },
          { hour: '12:00', score: 74 }, { hour: '15:00', score: 55 },
          { hour: '18:00', score: 88 }, { hour: '21:00', score: 95 },
          { hour: '00:00', score: 40 },
        ],
      },
      contentIdeas: [
        { title: 'Best Budget Microphones Under $100 (2026)', type: 'YouTube Long-form', confidence: 92, tags: ['gear', 'budget', 'audio'] },
        { title: '5 AI Tools Every Creator Needs Right Now', type: 'YouTube Short', confidence: 88, tags: ['AI', 'productivity'] },
        { title: 'Day in My Life as a Full-Time Creator', type: 'Instagram Reel', confidence: 84, tags: ['lifestyle', 'vlog'] },
        { title: 'How I Made $24K from Brand Deals This Month', type: 'YouTube Long-form', confidence: 79, tags: ['money', 'creator economy'] },
      ],
      brandMatches: [
        { brand: 'Logitech', category: 'Tech', matchScore: 94, estimatedValue: '$6,000–$10,000', reason: 'Your tech review niche aligns with their creator-focused product line' },
        { brand: 'Squarespace', category: 'Website', matchScore: 89, estimatedValue: '$3,500–$7,000', reason: 'Strong audience overlap with creators and entrepreneurs' },
        { brand: 'Audible', category: 'Education', matchScore: 85, estimatedValue: '$2,000–$4,000', reason: 'Your audience skews 25–34, high purchase intent for books' },
        { brand: 'Rode Mics', category: 'Audio', matchScore: 82, estimatedValue: '$1,500–$3,000', reason: 'Your studio setup content performs well — high gear interest signal' },
      ],
    },
    generatedAt: new Date(),
    modelVersion: '1.0.0-stub', // replace with your model version
  });
});

// POST /api/ai/forecast
router.post('/forecast',
  auth,
  [
    body('platform').isIn(['youtube', 'instagram', 'tiktok']).withMessage('Invalid platform'),
    body('contentType').optional().isString(),
    body('scheduledAt').optional().isISO8601(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { platform, contentType, scheduledAt } = req.body;

    // Stub response — replace with XGBoost / Random Forest model call
    const baseViews = { youtube: 25000, instagram: 12000, tiktok: 45000 };
    const base = baseViews[platform] || 20000;

    const dayOfWeek = scheduledAt ? new Date(scheduledAt).getDay() : new Date().getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.25 : 1;

    const projectedViews = Math.round(base * weekendMultiplier * (0.85 + Math.random() * 0.3));
    const projectedEngagement = +(3.5 + Math.random() * 3).toFixed(1);

    res.json({
      success: true,
      forecast: {
        platform,
        contentType: contentType || 'standard',
        projectedViews,
        projectedEngagement,
        projectedLikes: Math.round(projectedViews * 0.04),
        projectedComments: Math.round(projectedViews * 0.008),
        confidence: Math.round(88 + Math.random() * 7),
        modelAccuracy: '92–95%',
        recommendations: [
          `Post on ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayOfWeek]} between 8–10 PM for best reach`,
          'Use a strong hook in the first 3 seconds to retain viewers',
          'Add 3–5 relevant hashtags to improve discoverability',
        ],
      },
    });
  }
);

// GET /api/ai/brand-matches
router.get('/brand-matches', auth, async (req, res) => {
  try {
    const deals = await Deal.find({ userId: req.user._id }).lean();
    const existingBrands = deals.map(d => d.brand.toLowerCase());

    const matches = [
      { brand: 'Logitech',    category: 'Tech',         matchScore: 94, estimatedValue: '$6,000–$10,000', reason: 'Your tech review niche aligns with their creator-focused product line', contacted: false },
      { brand: 'Squarespace', category: 'Website',      matchScore: 89, estimatedValue: '$3,500–$7,000',  reason: 'Strong audience overlap with creators and entrepreneurs',             contacted: false },
      { brand: 'Audible',     category: 'Education',    matchScore: 85, estimatedValue: '$2,000–$4,000',  reason: 'Your audience skews 25–34, high purchase intent for books',           contacted: false },
      { brand: 'Rode Mics',   category: 'Audio',        matchScore: 82, estimatedValue: '$1,500–$3,000',  reason: 'Your studio setup content performs well',                             contacted: false },
      { brand: 'NordVPN',     category: 'Tech/Security',matchScore: 78, estimatedValue: '$2,500–$5,000',  reason: 'Proven track record in tech content monetization',                     contacted: false },
    ].filter(m => !existingBrands.includes(m.brand.toLowerCase()));

    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/ai/content-suggestions
router.get('/content-suggestions', auth, (req, res) => {
  res.json({
    success: true,
    data: [
      { title: 'Best Budget Microphones Under $100 (2026)', type: 'YouTube Long-form', confidence: 92, estimatedViews: '80K–150K', tags: ['gear', 'budget', 'audio'], trendingScore: 88 },
      { title: '5 AI Tools Every Creator Needs Right Now', type: 'YouTube Short', confidence: 88, estimatedViews: '200K–500K', tags: ['AI', 'productivity'], trendingScore: 95 },
      { title: 'Day in My Life as a Full-Time Creator', type: 'Instagram Reel', confidence: 84, estimatedViews: '40K–80K', tags: ['lifestyle', 'vlog'], trendingScore: 72 },
      { title: 'How I Made $24K from Brand Deals This Month', type: 'YouTube Long-form', confidence: 79, estimatedViews: '60K–120K', tags: ['money', 'creator economy'], trendingScore: 81 },
    ],
  });
});

// GET /api/ai/posting-time
router.get('/posting-time', auth, (req, res) => {
  res.json({
    success: true,
    data: {
      youtube:   { bestDay: 'Thursday', bestHour: '20:00', timezone: 'IST', engagementLift: '+42%' },
      instagram: { bestDay: 'Friday',   bestHour: '19:00', timezone: 'IST', engagementLift: '+31%' },
      tiktok:    { bestDay: 'Saturday', bestHour: '22:00', timezone: 'IST', engagementLift: '+58%' },
    },
  });
});

// POST /api/ai/chat
router.post('/chat',
  auth,
  [body('messages').isArray({ min: 1 }).withMessage('Messages array required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { messages } = req.body;
    const lastMessage = messages[messages.length - 1]?.text?.toLowerCase() || '';

    /**
     * TODO: Replace this rule-based stub with your ML model (e.g., fine-tuned LLM).
     * Expected interface: aiModel.chat(userId, messages) → string
     */
    let reply = "Based on your current analytics, I'd recommend focusing on your highest-engagement content format and scheduling posts during peak activity windows.";

    if (lastMessage.includes('best time') || lastMessage.includes('posting time')) {
      reply = "Based on your audience data, your best posting times are **Thursday–Friday between 6–9 PM IST**. Engagement is 42% higher during these windows compared to morning posts.";
    } else if (lastMessage.includes('content') || lastMessage.includes('strategy')) {
      reply = "Your top performing content is tech reviews and gear roundups. I recommend doubling down on comparison videos (e.g., 'X vs Y') — they get 2.3× more impressions from search.";
    } else if (lastMessage.includes('brand') || lastMessage.includes('deal')) {
      reply = `You have ${messages.length > 1 ? 'several' : '3'} open brand deals. The Nike deal deadline is in 3 days — I recommend sending the deliverable draft today for timely review.`;
    } else if (lastMessage.includes('audience') || lastMessage.includes('followers')) {
      reply = "Your audience is 68% male, aged 22–34. Top locations: India (42%), USA (28%), UK (11%). They're most active on weekday evenings — high interest in tech and productivity tools.";
    } else if (lastMessage.includes('forecast') || lastMessage.includes('predict')) {
      reply = "Based on current trajectory and historical patterns, I forecast 312K views and 5.6% avg engagement over the next 7 days — an 18% improvement vs last week. Model accuracy: 92–95%.";
    }

    res.json({
      success: true,
      reply,
      role: 'assistant',
      timestamp: new Date(),
    });
  }
);

module.exports = router;
