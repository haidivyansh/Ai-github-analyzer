import express from 'express';
import {
  getGithubRepoInfo,
  getGithubLanguages,
  getGithubFiles,
  getGithubContributors,
  getGithubCommits
} from '../controllers/githubController.js';

const router = express.Router();

router.get('/repository', getGithubRepoInfo);
router.get('/languages', getGithubLanguages);
router.get('/files', getGithubFiles);
router.get('/contributors', getGithubContributors);
router.get('/commits', getGithubCommits);

export default router;
