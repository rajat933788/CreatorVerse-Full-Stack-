require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Deal = require('../models/Deal');
const Task = require('../models/Task');
const TeamMember = require('../models/TeamMember');

const seedDatabase = async () => {
  try {
    const isCLI = require.main === module;
    if (isCLI) {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/creatorverse';
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoURI);
      }
      console.log('Connected to MongoDB');
    }

    // Check if demo user exists
    const existing = await User.findOne({ email: 'demo@creatorverse.ai' });
    if (existing && !isCLI) {
      console.log('ℹ️   Seed skipped — demo user already exists');
      return;
    }

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Deal.deleteMany({}),
      Task.deleteMany({}),
      TeamMember.deleteMany({})
    ]);
    if (isCLI) console.log('Cleared existing data');

    // Hash passwords
    const demoPassword = await bcrypt.hash('demo123', 12);
    const testPassword = await bcrypt.hash('test123', 12);

    // Create 2 Users
    const user1 = await User.create({
      name: 'Demo Creator',
      email: 'demo@creatorverse.ai',
      password: demoPassword,
      plan: 'professional',
      platforms: ['youtube', 'instagram']
    });

    const user2 = await User.create({
      name: 'Test Creator',
      email: 'creator@test.com',
      password: testPassword,
      plan: 'starter',
      platforms: ['tiktok']
    });

    const users = [user1, user2];

    for (const user of users) {
      const userId = user._id;

      // 5 Brand Deals
      const deals = [
        { userId, brand: 'Nike', value: 5000, status: 'active', due: '2026-05-10' },
        { userId, brand: 'Adidas', value: 3200, status: 'completed', due: '2026-04-15' },
        { userId, brand: 'Sony', value: 8500, status: 'negotiation', due: '2026-06-01' },
        { userId, brand: 'Samsung', value: 12000, status: 'delivered', due: '2026-04-20' },
        { userId, brand: 'Squarespace', value: 2500, status: 'lead', due: '2026-05-25' }
      ];
      await Deal.insertMany(deals);

      // 8 Tasks
      const tasks = [
        { userId, title: 'Edit Vlog 45', assignee: 'Alex', priority: 'high', status: 'in_progress', due: '2026-04-28' },
        { userId, title: 'Review Nike Brief', assignee: 'Maya', priority: 'medium', status: 'todo', due: '2026-04-30' },
        { userId, title: 'Record Voiceover', assignee: 'Self', priority: 'high', status: 'todo', due: '2026-04-26' },
        { userId, title: 'Approve Thumbnail', assignee: 'Sarah', priority: 'medium', status: 'review', due: '2026-04-27' },
        { userId, title: 'Send Invoice to Sony', assignee: 'Manager', priority: 'low', status: 'done', due: '2026-04-25' },
        { userId, title: 'Brainstorm IG Reels', assignee: 'Team', priority: 'low', status: 'todo', due: '2026-05-02' },
        { userId, title: 'Sign Adidas Contract', assignee: 'Self', priority: 'high', status: 'done', due: '2026-04-10' },
        { userId, title: 'Update Media Kit', assignee: 'Designer', priority: 'medium', status: 'in_progress', due: '2026-05-05' }
      ];
      await Task.insertMany(tasks);

      // 4 Team Members
      const teamMembers = [
        { userId, name: 'Alex', email: 'alex@example.com', role: 'editor', status: 'active' },
        { userId, name: 'Sarah', email: 'sarah@example.com', role: 'designer', status: 'active' },
        { userId, name: 'Maya', email: 'maya@example.com', role: 'manager', status: 'active' },
        { userId, name: 'Jordan', email: 'jordan@example.com', role: 'writer', status: 'invited' }
      ];
      await TeamMember.insertMany(teamMembers);
    }

    if (isCLI) console.log('Seeding complete');
    if (isCLI) process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    if (require.main === module) process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
