import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/appError';
import { sanitizeInput, preventNoSQLInjection, trimInput } from './middleware/sanitize';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import messageRoutes from './routes/messageRoutes';
import experienceRoutes from './routes/experienceRoutes';
import skillRoutes from './routes/skillRoutes';
import uploadRoutes from './routes/uploadRoutes';
import profileRoutes from './routes/profileRoutes';
import { env } from './config/env';

const app = express();

// CORS - Get allowed origins early
const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());

// 1) GLOBAL MIDDLEWARE
// Set security HTTP headers with enhanced Helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "*.cloudinary.com"],
      connectSrc: ["'self'", ...allowedOrigins],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API server
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
}));

// Development logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Input sanitization middleware
app.use(sanitizeInput);
app.use(preventNoSQLInjection);
app.use(trimInput);

// CORS - Restrict to specific origins
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// 2) ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  res.send('Portfolio API is running...');
});

// Handle unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 3) GLOBAL ERROR HANDLER
app.use(errorHandler);

export default app;
