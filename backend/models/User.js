const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },
  plan:      { type: String, enum: ['starter', 'professional', 'agency'], default: 'starter' },
  platforms: [String],
  bio:       { type: String, default: '' },
  location:  { type: String, default: '' },
  avatar:    { type: String, default: '' },
  theme:     { type: String, enum: ['light', 'dark'], default: 'light' },
  notifications: {
    brandAlerts:     { type: Boolean, default: true },
    taskReminders:   { type: Boolean, default: true },
    aiSuggestions:   { type: Boolean, default: true },
    weeklyReport:    { type: Boolean, default: true },
    newMessages:     { type: Boolean, default: false },
    paymentReceived: { type: Boolean, default: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
