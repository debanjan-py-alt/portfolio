require('dotenv').config();
const path       = require('path');
const helmet     = require('helmet');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const connectDB  = require('./config/db');
const contactRoutes  = require('./routes/contactRoutes');
const errorHandler   = require('./middleware/errorHandler');

// ─── Connect Database ──────────────────────────────────────────────────────
connectDB();

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS policy: origin "${origin}" not allowed`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// ─── Rate Limiting ─────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,                   // limit each IP to 50 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Stricter limiter for the contact form (prevent spam)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                    // max 5 form submissions per hour per IP
  message: { success: false, message: 'Too many messages sent. Please try again in an hour.' },
});
app.use('/api/contact', contactLimiter);

// ─── Body Parser ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ─── Serve Frontend Static Files ──────────────────────────────────────────
// Serves index.html, styles.css, script.js from the Website folder
const frontendPath = path.join(__dirname, '..', 'Frontend');
app.use(express.static(frontendPath));

// ─── API Health Check ──────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Portfolio API is running',
    version: '1.0.0',
  });
});

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/contact', contactRoutes);

// ─── 404 Handler ───────────────────────────────────────────────────────────
// For unknown API routes return JSON 404. For everything else serve the frontend.
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
  }
  // Fallback: serve the portfolio index.html
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ─── Global Error Handler ──────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
