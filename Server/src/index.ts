import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import parentRoutes from './routes/parentRoutes';
import societalRoutes from './routes/societalRoutes';

// new swagger imports
import { swaggerSpec, swaggerUiServe, swaggerUiSetup } from './util/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ----- GLOBAL RATE LIMIT -----
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests from this IP. Please slow down."
  }
});

app.use(globalLimiter);

// ----- STRICT LIMIT FOR EXPENSIVE ENDPOINTS (AI inference etc.) -----
const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50,                  // only 50 hits allowed per 5 minutes
  message: {
    status: "error",
    message: "Rate limit exceeded for AI tool. Try again later."
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// ----- SWAGGER UI -----
app.use('/api/docs', swaggerUiServe, swaggerUiSetup(swaggerSpec));

// Routes
app.use('/api/parent', aiLimiter, parentRoutes);
app.use('/api/societal', aiLimiter, societalRoutes);

// ----- DB Connection -----
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
