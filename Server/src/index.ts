// src/app.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRouter from './routes/auth.router';
import apiRouter from './routes/router';
import { requireAuth } from './middleware/auth';

import {
  swaggerSpec,
  swaggerUiServe,
  swaggerUiSetup
} from './util/swagger';

const app = express();
const PORT = process.env.PORT || 8000;

// ---------------- CORS ----------------
const isDevelopment = process.env.NODE_ENV !== 'production';
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ];

// ---------------- CORS (ALLOW ALL) ----------------
app.use(cors({
  origin: true,            // reflect request origin
  credentials: true,       // allow cookies / auth headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());

// ---------------- Swagger ----------------
app.use(
  '/api/docs',
  swaggerUiServe,
  swaggerUiSetup(swaggerSpec)
);

// ---------------- Debug Logger ----------------
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.path} AUTH:`, req.headers.authorization || 'none');
  next();
});


// ---------------- Public Auth Routes ----------------
app.use('/api/auth', authRouter);

// ---------------- Protected Routes ----------------
// app.use('/api', requireAuth);  //dont remove this 
app.use('/api', apiRouter);

// ---------------- MongoDB ----------------
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// ---------------- Start Server ----------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api/docs`);
});
