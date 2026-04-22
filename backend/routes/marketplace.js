const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const FREELANCERS = [
  { _id: 'fl-1', name: 'Priya Sharma', skill: 'Video Editor', location: 'Mumbai, IN', rating: 4.9, reviews: 142, rate: 45, tags: ['YouTube', 'Color Grading', 'After Effects'], category: 'Video Editing', bio: 'Professional video editor with 5+ years in creator content.', verified: true, completedJobs: 184 },
  { _id: 'fl-2', name: 'Alex Thompson', skill: 'Thumbnail Designer', location: 'London, UK', rating: 4.8, reviews: 98, rate: 35, tags: ['Photoshop', 'CTR Optimization', 'YouTube'], category: 'Thumbnail Design', bio: 'Designed thumbnails for channels with 1M+ subscribers.', verified: true, completedJobs: 121 },
  { _id: 'fl-3', name: 'Riya Mehta', skill: 'Copywriter & Scriptwriter', location: 'Delhi, IN', rating: 4.7, reviews: 64, rate: 30, tags: ['Scripts', 'SEO', 'Hooks'], category: 'Copywriting', bio: 'YouTube script writer with deep understanding of retention hooks.', verified: false, completedJobs: 78 },
  { _id: 'fl-4', name: 'Carlos Rivera', skill: 'Motion Graphics Artist', location: 'Bogotá, CO', rating: 4.9, reviews: 211, rate: 55, tags: ['After Effects', 'Cinema 4D', 'Intros'], category: 'Motion Graphics', bio: 'Crafting stunning motion graphics and intros for top creators.', verified: true, completedJobs: 256 },
  { _id: 'fl-5', name: 'Yuki Tanaka', skill: 'Graphic Designer', location: 'Tokyo, JP', rating: 4.6, reviews: 77, rate: 40, tags: ['Brand Identity', 'Illustrator', 'Canva'], category: 'Graphic Design', bio: 'Minimal, aesthetic design for creator brands.', verified: true, completedJobs: 93 },
  { _id: 'fl-6', name: 'Nadia Okafor', skill: 'Social Media Manager', location: 'Lagos, NG', rating: 4.8, reviews: 55, rate: 25, tags: ['Instagram', 'TikTok', 'Scheduling'], category: 'Social Media', bio: 'Full-service social media management for creators.', verified: false, completedJobs: 67 },
];

let listings = [
  { _id: 'lst-1', userId: 'demo-user-1', title: 'Need experienced YouTube video editor', category: 'Video Editing', budget: '$500–$800', deadline: '2026-05-01', proposals: 6, status: 'open', createdAt: new Date() },
  { _id: 'lst-2', userId: 'demo-user-1', title: 'Thumbnail designer for tech channel', category: 'Thumbnail Design', budget: '$200–$400/mo', deadline: '2026-04-30', proposals: 12, status: 'open', createdAt: new Date() },
];

// GET /api/marketplace/freelancers
router.get('/freelancers', auth, (req, res) => {
  const { category, search, minRate, maxRate, verified, page = 1, limit = 12 } = req.query;

  let results = [...FREELANCERS];

  if (category && category !== 'All') {
    results = results.filter(f => f.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.skill.toLowerCase().includes(q) ||
      f.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  if (minRate) results = results.filter(f => f.rate >= Number(minRate));
  if (maxRate) results = results.filter(f => f.rate <= Number(maxRate));
  if (verified === 'true') results = results.filter(f => f.verified);

  const total = results.length;
  const paginated = results.slice((page - 1) * limit, page * limit);

  res.json({
    success: true,
    data: paginated,
    pagination: { total, page: Number(page), limit: Number(limit) },
  });
});

// GET /api/marketplace/freelancers/:id
router.get('/freelancers/:id', auth, (req, res) => {
  const f = FREELANCERS.find(f => f._id === req.params.id);
  if (!f) return res.status(404).json({ success: false, message: 'Freelancer not found' });
  res.json({ success: true, data: f });
});

// GET /api/marketplace/listings
router.get('/listings', auth, (req, res) => {
  const userListings = listings.filter(l => l.userId === req.user._id);
  res.json({ success: true, data: userListings });
});

// POST /api/marketplace/listings
router.post('/listings',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Job title required'),
    body('category').trim().notEmpty().withMessage('Category required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const listing = {
      _id: `lst-${Date.now()}`,
      userId: req.user._id,
      ...req.body,
      proposals: 0,
      status: 'open',
      createdAt: new Date(),
    };
    listings.push(listing);

    res.status(201).json({ success: true, data: listing, message: 'Job listing created' });
  }
);

// POST /api/marketplace/listings/:id/apply
router.post('/listings/:id/apply', auth, (req, res) => {
  const listing = listings.find(l => l._id === req.params.id);
  if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

  listing.proposals = (listing.proposals || 0) + 1;
  res.json({ success: true, message: 'Application submitted', listing });
});

// POST /api/marketplace/hire/:freelancerId
router.post('/hire/:freelancerId',
  auth,
  [
    body('project').trim().notEmpty().withMessage('Project description required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const freelancer = FREELANCERS.find(f => f._id === req.params.freelancerId);
    if (!freelancer) return res.status(404).json({ success: false, message: 'Freelancer not found' });

    const hire = {
      _id: `hire-${Date.now()}`,
      freelancerId: freelancer._id,
      freelancerName: freelancer.name,
      hirerId: req.user._id,
      status: 'pending',
      ...req.body,
      createdAt: new Date(),
    };

    res.status(201).json({
      success: true,
      data: hire,
      message: `Hire request sent to ${freelancer.name}. They'll respond within 24 hours.`,
    });
  }
);

module.exports = router;
