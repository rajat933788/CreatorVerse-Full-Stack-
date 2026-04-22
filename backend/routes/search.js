const express  = require('express');
const router   = express.Router();
const { auth } = require('../middleware/auth');
const Deal       = require('../models/Deal');
const Task       = require('../models/Task');
const TeamMember = require('../models/TeamMember');

// GET /api/search?q=query
router.get('/', auth, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 1) return res.json({ success: true, results: [] });

    const regex  = new RegExp(q, 'i');
    const userId = req.user._id;
    const LIMIT  = 5;

    const [deals, tasks, members] = await Promise.all([
      Deal.find({ userId, $or: [{ brand: regex }, { category: regex }, { deliverables: regex }, { contact: regex }] })
        .select('brand category status value').limit(LIMIT).lean(),

      Task.find({ userId, $or: [{ title: regex }, { assignee: regex }] })
        .select('title status priority due').limit(LIMIT).lean(),

      TeamMember.find({ userId, $or: [{ name: regex }, { email: regex }, { role: regex }] })
        .select('name email role status').limit(LIMIT).lean(),
    ]);

    const results = [
      ...deals.map(d   => ({ type: 'deal',   id: d._id, title: d.brand,  subtitle: `${d.category || 'Deal'} · $${d.value.toLocaleString()}`, status: d.status, url: '/crm' })),
      ...tasks.map(t   => ({ type: 'task',   id: t._id, title: t.title,  subtitle: `${t.priority} priority · ${t.status.replace('_',' ')}`,  status: t.status, url: '/team' })),
      ...members.map(m => ({ type: 'member', id: m._id, title: m.name,   subtitle: `${m.role} · ${m.email}`, status: m.status, url: '/team' })),
    ];

    res.json({ success: true, results, query: q });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
