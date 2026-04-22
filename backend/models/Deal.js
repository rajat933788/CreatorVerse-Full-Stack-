const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand:        { type: String, required: true, trim: true },
  category:     { type: String, default: '' },
  value:        { type: Number, required: true, default: 0 },
  status:       { type: String, enum: ['lead', 'negotiation', 'active', 'delivered', 'completed', 'cancelled'], default: 'lead' },
  due:          { type: String, default: '' },
  contact:      { type: String, default: '' },
  deliverables: { type: String, default: '' },
  paid:         { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);
