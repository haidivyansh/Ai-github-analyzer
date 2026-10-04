import express from 'express';
import { analyzeRepository, testGemini } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/test', testGemini);
router.post('/analyze', protect, analyzeRepository);

export default router;
