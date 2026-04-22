const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Helpers to generate synthetic but realistic analytics data
const generateTrend = (days, base, variance) => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const weekendBoost = dayOfWeek === 0 || dayOfWeek === 6 ? 1.3 : 1;
    const val = Math.round((base + (Math.random() - 0.4) * variance) * weekendBoost);
    data.push({
      date: date.toISOString().slice(0, 10),
      value: Math.max(0, val),
    });
  }
  return data;
};

// GET /api/analytics/overview
router.get('/overview', auth, (req, res) => {
  res.json({
    success: true,
    data: {
      totalViews: 284600,
      followers: 142800,
      engagementRate: 4.8,
      monthlyRevenue: 24500,
      viewsChange: 12.4,
      followersChange: 8.1,
      engagementChange: -1.2,
      revenueChange: 22.3,
      platforms: {
        youtube:   { followers: 84200,  views: 1240000, engagement: 5.4 },
        instagram: { followers: 42600,  views: 384000,  engagement: 4.1 },
        tiktok:    { followers: 15800,  views: 520000,  engagement: 7.2 },
      },
    },
  });
});

// GET /api/analytics/engagement-trend?days=30
router.get('/engagement-trend', auth, (req, res) => {
  const days = Math.min(parseInt(req.query.days) || 30, 365);
  const youtube   = generateTrend(days, 18000, 8000);
  const instagram = generateTrend(days, 9000,  4000);
  const tiktok    = generateTrend(days, 14000, 10000);

  const merged = youtube.map((y, i) => ({
    date: y.date,
    youtube:   y.value,
    instagram: instagram[i].value,
    tiktok:    tiktok[i].value,
    total:     y.value + instagram[i].value + tiktok[i].value,
  }));

  res.json({ success: true, data: merged });
});

// GET /api/analytics/platform/:platform
router.get('/platform/:platform', auth, (req, res) => {
  const { platform } = req.params;
  const validPlatforms = ['youtube', 'instagram', 'tiktok', 'twitter'];

  if (!validPlatforms.includes(platform)) {
    return res.status(400).json({ success: false, message: 'Invalid platform' });
  }

  const baseData = {
    youtube:   { followers: 84200, views: 1240000, likes: 48200, comments: 8600, shares: 3200, engagement: 5.4 },
    instagram: { followers: 42600, views: 384000,  likes: 18600, comments: 2400, shares: 1800, engagement: 4.1 },
    tiktok:    { followers: 15800, views: 520000,  likes: 42400, comments: 6200, shares: 8400, engagement: 7.2 },
    twitter:   { followers: 8200,  views: 94000,   likes: 3800,  comments: 620,  shares: 1200, engagement: 2.8 },
  };

  res.json({
    success: true,
    platform,
    data: {
      ...baseData[platform],
      trend: generateTrend(30, baseData[platform].views / 30, baseData[platform].views / 10),
    },
  });
});

// GET /api/analytics/top-content
router.get('/top-content', auth, (req, res) => {
  res.json({
    success: true,
    data: [
      { title: 'iPhone 16 Pro Max Review', platform: 'youtube', views: 148000, likes: 8200, comments: 1240, engagement: 6.8, publishedAt: '2026-04-10' },
      { title: 'Morning Routine 2026',     platform: 'instagram', views: 84000, likes: 4100, comments: 380, engagement: 5.4, publishedAt: '2026-04-14' },
      { title: 'Best Budget Phones',       platform: 'tiktok', views: 312000, likes: 28000, comments: 2800, engagement: 9.1, publishedAt: '2026-04-08' },
      { title: 'My Studio Setup Tour',     platform: 'youtube', views: 96000, likes: 5600, comments: 890, engagement: 5.9, publishedAt: '2026-04-05' },
      { title: 'Coffee Shop Vlog',         platform: 'instagram', views: 52000, likes: 2800, comments: 210, engagement: 4.2, publishedAt: '2026-04-17' },
    ],
  });
});

// POST /api/analytics/connect
router.post('/connect', auth, (req, res) => {
  const { platform, code } = req.body;
  if (!platform) {
    return res.status(400).json({ success: false, message: 'Platform required' });
  }
  // In production: exchange OAuth code for access token, store securely
  res.json({
    success: true,
    message: `${platform} connected successfully`,
    platform,
    connected: true,
  });
});

module.exports = router;
