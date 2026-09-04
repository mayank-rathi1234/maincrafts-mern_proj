require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const contactRoutes = require('./routes/contactRoutes');
const taskRoutes = require('./routes/taskRoutes');

const PORT = process.env.PORT || 5000;

// ── Database ────────────────────────────────────────────────
connectDB();

// ── App setup ───────────────────────────────────────────────
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// CORS — only allow the configured React frontend origin(s)
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (curl/Postman) with no origin header
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

// Basic rate limiting on the API to guard against abuse/spam submissions
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// ── Routes ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: 'MainCrafts API is running 🚀' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/contacts', contactRoutes);
app.use('/api/tasks', taskRoutes);

// ── Error handling (must be last) ──────────────────────────
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 MainCrafts API listening on http://localhost:${PORT}`);
});
