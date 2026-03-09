import express from 'express';
import { getCache } from '../utils/cache.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: Date.now(),
    message: 'Server is running fast! ⚡'
  });
});

export default router;
