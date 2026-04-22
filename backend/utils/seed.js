const bcrypt = require('bcryptjs');
const User       = require('../models/User');
const Deal       = require('../models/Deal');
const Task       = require('../models/Task');
const TeamMember = require('../models/TeamMember');

const seedDatabase = async () => {
  try {
    const existing = await User.findOne({ email: 'demo@creatorverse.ai' });
    if (existing) {
      console.log('ℹ️   Seed skipped — demo user already exists');
      return;
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo1234', 12);
    const user = await User.create({
      name:      'Admin',
      email:     'demo@creatorverse.ai',
      password:  hashedPassword,
      plan:      'professional',
      platforms: ['youtube', 'instagram'],
      bio:       '',
      location:  '',
    });

    const uid = user._id;

    // Seed deals
    await Deal.insertMany([
      { userId: uid, brand: 'Nike',      category: 'Sports',      value: 8500,  status: 'active',      due: '2026-05-10', contact: 'Sarah Kim',    deliverables: 'YouTube Review + 3 IG posts',    paid: false },
      { userId: uid, brand: 'Spotify',   category: 'Music',       value: 4200,  status: 'negotiation', due: '2026-04-28', contact: 'Tom Reed',     deliverables: '2 YouTube integrations',          paid: false },
      { userId: uid, brand: 'Adobe',     category: 'Software',    value: 12000, status: 'delivered',   due: '2026-04-15', contact: 'Priya Sharma', deliverables: 'Tutorial series (4 videos)',      paid: true  },
      { userId: uid, brand: 'Samsung',   category: 'Tech',        value: 9800,  status: 'lead',        due: '2026-06-01', contact: 'James Park',   deliverables: 'Phone unboxing + review',         paid: false },
      { userId: uid, brand: 'Skillshare',category: 'Education',   value: 3500,  status: 'completed',   due: '2026-03-30', contact: 'Anna Müller',  deliverables: 'Class promotion reel',            paid: true  },
      { userId: uid, brand: 'Notion',    category: 'Productivity',value: 5600,  status: 'active',      due: '2026-05-22', contact: 'David Lee',    deliverables: 'Workflow tutorial + IG stories',  paid: false },
    ]);

    // Seed tasks
    await Task.insertMany([
      { userId: uid, title: 'Edit YouTube video #47 — iPhone review',     status: 'in_progress', assignee: 'Alex Chen',   priority: 'high',   due: '2026-04-23', tags: ['video', 'editing'] },
      { userId: uid, title: 'Review Nike brand proposal contract',         status: 'review',      assignee: 'You',          priority: 'high',   due: '2026-04-22', tags: ['brand', 'legal']   },
      { userId: uid, title: 'Schedule Instagram posts for next week',      status: 'todo',        assignee: 'Maya Patel',  priority: 'medium', due: '2026-04-25', tags: ['social']           },
      { userId: uid, title: 'Create thumbnail for unboxing video',         status: 'in_progress', assignee: 'Ravi Kumar',  priority: 'medium', due: '2026-04-24', tags: ['design']           },
      { userId: uid, title: 'Write script for tech comparison video',      status: 'todo',        assignee: 'You',          priority: 'low',    due: '2026-04-28', tags: ['script']           },
      { userId: uid, title: 'Deliver Adobe tutorial final cut',            status: 'done',        assignee: 'Alex Chen',   priority: 'high',   due: '2026-04-14', tags: ['video', 'brand']   },
    ]);

    // Seed team members
    await TeamMember.insertMany([
      { userId: uid, name: 'Alex Chen',   role: 'editor',   email: 'alex@studio.com',  avatar: 'A', status: 'active' },
      { userId: uid, name: 'Maya Patel',  role: 'manager',  email: 'maya@studio.com',  avatar: 'M', status: 'active' },
      { userId: uid, name: 'Ravi Kumar',  role: 'designer', email: 'ravi@studio.com',  avatar: 'R', status: 'active' },
    ]);

    console.log('✅  Database seeded — demo user, deals, tasks & team created');
  } catch (err) {
    console.error('❌  Seed error:', err.message);
  }
};

module.exports = seedDatabase;
