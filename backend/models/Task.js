const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, required: true, trim: true },
  status:   { type: String, enum: ['todo', 'in_progress', 'review', 'done'], default: 'todo' },
  assignee: { type: String, default: '' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  due:      { type: String, default: '' },
  tags:     [String],
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
