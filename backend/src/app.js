import 'express-async-errors'; // Must be the first import
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { generalLimiter } from './middleware/rateLimiter.js';
import roastRouter from './routes/roast.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// 1. Setup Helmet for security headers
app.use(helmet());

// 2. Setup CORS options
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        process.env.FRONTEND_URL,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
        /\.vercel\.app$/
      ].filter(Boolean)
    : '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// 3. Parse JSON payloads (max 10kb)
app.use(express.json({ limit: '10kb' }));

// 4. Apply general rate limiter to all routes
app.use(generalLimiter);

// 5. Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'link-roaster-api'
  });
});

// 6 & 7. Mount routes
app.use('/api/roast', roastRouter);
app.use('/api/roasts', roastRouter);

// 8. Custom 404 Handler for missing routes
app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: 'Route not found'
  });
});

// 9. Global Error Handler (must be last)
app.use(errorHandler);

export default app;
