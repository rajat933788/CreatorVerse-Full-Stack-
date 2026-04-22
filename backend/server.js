require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route modules
const authRoutes        = require('./routes/auth');
const analyticsRoutes   = require('./routes/analytics');
const crmRoutes         = require('./routes/crm');
const teamRoutes        = require('./routes/team');
const marketplaceRoutes = require('./routes/marketplace');
const aiRoutes          = require('./routes/ai');
const searchRoutes      = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Connect Database ────────────────────────────────────────────────────────
connectDB();

// ── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

app.use(globalLimiter);

// ── General Middleware ──────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CreatorVerse.AI API',
    version: '1.0.0',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth',        authLimiter, authRoutes);
app.use('/api/analytics',   analyticsRoutes);
app.use('/api/crm',         crmRoutes);
app.use('/api/team',        teamRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/ai',          aiRoutes);
app.use('/api/search',      searchRoutes);

// ── API Docs stub ───────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    service: 'CreatorVerse.AI REST API',
    version: '1.0.0',
    endpoints: {
      auth:        '/api/auth — register, login, me, profile, change-password',
      analytics:   '/api/analytics — overview, engagement-trend, platform/:id, top-content, connect',
      crm:         '/api/crm — deals CRUD, brands, invoices',
      team:        '/api/team — members CRUD, tasks CRUD',
      marketplace: '/api/marketplace — freelancers, listings, hire',
      ai:          '/api/ai — recommendations, forecast, brand-matches, content-suggestions, posting-time, chat',
    },
    docs: 'See /api/docs (Swagger — coming soon)',
  });
});

// ── Error Handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log(`║   CreatorVerse.AI API                    ║`);
  console.log(`║   Running on http://localhost:${PORT}       ║`);
  console.log(`║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(25)}║`);
  console.log('╚══════════════════════════════════════════╝\n');
});

module.exports = app;
