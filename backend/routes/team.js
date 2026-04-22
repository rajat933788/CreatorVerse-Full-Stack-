const express    = require('express');
const router     = express.Router();
const { body, validationResult } = require('express-validator');
const { auth }   = require('../middleware/auth');
const Task       = require('../models/Task');
const TeamMember = require('../models/TeamMember');

// ── Members ────────────────────────────────────────────────────────────────

// GET /api/team/members
router.get('/members', auth, async (req, res) => {
  try {
    const members = await TeamMember.find({ userId: req.user._id }).lean();
    const ownerEntry = {
      _id: req.user._id,
      name: `${req.user.name} (You)`,
      role: 'admin',
      email: req.user.email,
      avatar: req.user.name[0].toUpperCase(),
      isOwner: true,
    };
    res.json({ success: true, data: [ownerEntry, ...members] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/team/invite
router.post('/invite', auth,
  [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('role').isIn(['editor', 'designer', 'manager', 'writer', 'analyst']).withMessage('Invalid role'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { name, email, role } = req.body;
      const member = await TeamMember.create({
        userId: req.user._id, name, email, role,
        avatar: name[0].toUpperCase(), status: 'invited',
      });
      res.status(201).json({ success: true, data: member, message: `Invitation sent to ${email}` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PUT /api/team/members/:id/role
router.put('/members/:id/role', auth,
  [body('role').isIn(['editor', 'designer', 'manager', 'writer', 'analyst', 'admin'])],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    try {
      await TeamMember.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { role: req.body.role });
      res.json({ success: true, message: 'Role updated' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// DELETE /api/team/members/:id
router.delete('/members/:id', auth, async (req, res) => {
  try {
    const result = await TeamMember.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Tasks ──────────────────────────────────────────────────────────────────

// GET /api/team/tasks
router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/team/tasks
router.post('/tasks', auth,
  [
    body('title').trim().notEmpty().withMessage('Task title required'),
    body('status').optional().isIn(['todo', 'in_progress', 'review', 'done']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    try {
      const task = await Task.create({
        ...req.body,
        userId:   req.user._id,
        status:   req.body.status   || 'todo',
        priority: req.body.priority || 'medium',
        tags:     req.body.tags     || [],
      });
      res.status(201).json({ success: true, data: task, message: 'Task created' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PUT /api/team/tasks/:id
router.put('/tasks/:id', auth, async (req, res) => {
  try {
    const { _id, userId, createdAt, ...updates } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates, { new: true }
    ).lean();
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task, message: 'Task updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/team/tasks/:id/status
router.patch('/tasks/:id/status', auth,
  [body('status').isIn(['todo', 'in_progress', 'review', 'done'])],
  async (req, res) => {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { status: req.body.status }, { new: true }
      ).lean();
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      res.json({ success: true, data: task, message: 'Task status updated' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// DELETE /api/team/tasks/:id
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const result = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
