import express from 'express';
import {
  createRepository,
  getRepositories,
  getRepositoryById,
  deleteRepository
} from '../controllers/repositoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All repository routes are protected by JWT authentication
router.use(protect);

router.route('/')
  .post(createRepository)
  .get(getRepositories);

router.route('/:id')
  .get(getRepositoryById)
  .delete(deleteRepository);

export default router;
