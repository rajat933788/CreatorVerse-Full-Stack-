const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:   { type: String, required: true, trim: true },
  email:  { type: String, required: true, lowercase: true, trim: true },
  role:   { type: String, enum: ['editor', 'designer', 'manager', 'writer', 'analyst', 'admin'], default: 'editor' },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['active', 'invited', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
