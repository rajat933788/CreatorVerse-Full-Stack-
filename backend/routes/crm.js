const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Deal     = require('../models/Deal');

// GET /api/crm/deals
router.get('/deals', auth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user._id };
    if (status && status !== 'all') filter.status = status;
    if (search) filter.brand = { $regex: search, $options: 'i' };

    const total = await Deal.countDocuments(filter);
    const deals = await Deal.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      data: deals,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/crm/deals/:id
router.get('/deals/:id', auth, async (req, res) => {
  try {
    const deal = await Deal.findOne({ _id: req.params.id, userId: req.user._id }).lean();
    if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
    res.json({ success: true, data: deal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/crm/deals
router.post('/deals', auth,
  [
    body('brand').trim().notEmpty().withMessage('Brand name required'),
    body('value').isNumeric().withMessage('Deal value must be a number'),
    body('status').optional().isIn(['lead', 'negotiation', 'active', 'delivered', 'completed', 'cancelled']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const deal = await Deal.create({ ...req.body, userId: req.user._id, paid: false });
      res.status(201).json({ success: true, data: deal, message: 'Deal created' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PUT /api/crm/deals/:id
router.put('/deals/:id', auth, async (req, res) => {
  try {
    const { _id, userId, createdAt, ...updates } = req.body;
    const deal = await Deal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      { new: true }
    ).lean();
    if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
    res.json({ success: true, data: deal, message: 'Deal updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/crm/deals/:id
router.delete('/deals/:id', auth, async (req, res) => {
  try {
    const result = await Deal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return res.status(404).json({ success: false, message: 'Deal not found' });
    res.json({ success: true, message: 'Deal deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/crm/brands
router.get('/brands', auth, async (req, res) => {
  try {
    const deals = await Deal.find({ userId: req.user._id }).lean();
    const brandMap = {};
    deals.forEach(d => {
      if (!brandMap[d.brand]) brandMap[d.brand] = { name: d.brand, category: d.category, totalValue: 0, dealsCount: 0 };
      brandMap[d.brand].totalValue += d.value;
      brandMap[d.brand].dealsCount += 1;
    });
    res.json({ success: true, data: Object.values(brandMap) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/crm/invoices
router.get('/invoices', auth, async (req, res) => {
  try {
    const deals = await Deal.find({ userId: req.user._id, status: { $in: ['delivered', 'completed'] } }).lean();
    const invoices = deals.map((d, i) => ({
      id: `INV-2026-${String(i + 1).padStart(3, '0')}`,
      dealId: d._id,
      brand: d.brand,
      amount: d.value,
      status: d.paid ? 'paid' : 'pending',
      issuedAt: d.updatedAt || d.createdAt,
      dueAt: d.due,
    }));
    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/crm/invoices/:dealId
router.post('/invoices/:dealId', auth, async (req, res) => {
  try {
    const deal = await Deal.findOne({ _id: req.params.dealId, userId: req.user._id }).lean();
    if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
    const invoice = {
      id: `INV-2026-${Date.now()}`,
      dealId: deal._id,
      brand: deal.brand,
      amount: deal.value,
      status: 'pending',
      issuedAt: new Date(),
      dueAt: deal.due,
      lineItems: [{ description: deal.deliverables, amount: deal.value }],
    };
    res.status(201).json({ success: true, data: invoice, message: 'Invoice generated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
