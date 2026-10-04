import { parseGithubUrl } from '../utils/urlParser.js';
import {
  getRepository,
  getLanguages,
  getRepositoryContents,
  getContributors,
  getCommits
} from '../services/githubService.js';

// Helper to extract and validate repo URL query param
const parseUrlParam = (req, res) => {
  const urlParam = req.query.url;

  if (!urlParam) {
    res.status(400).json({
      success: false,
      message: 'Missing required query parameter: url (e.g. /api/github/repository?url=https://github.com/facebook/react)'
    });
    return null;
  }

  const parsed = parseGithubUrl(urlParam);
  if (!parsed.isValid) {
    res.status(400).json({
      success: false,
      message: parsed.error
    });
    return null;
  }

  return parsed;
};

// @desc    Get GitHub repository details
// @route   GET /api/github/repository?url=...
export const getGithubRepoInfo = async (req, res, next) => {
  try {
    const parsed = parseUrlParam(req, res);
    if (!parsed) return;

    const repository = await getRepository(parsed.owner, parsed.repo);

    res.status(200).json({
      success: true,
      repository
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// @desc    Get GitHub repository language breakdown
// @route   GET /api/github/languages?url=...
export const getGithubLanguages = async (req, res, next) => {
  try {
    const parsed = parseUrlParam(req, res);
    if (!parsed) return;

    const languages = await getLanguages(parsed.owner, parsed.repo);

    res.status(200).json({
      success: true,
      languages
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// @desc    Get GitHub repository top-level contents/files
// @route   GET /api/github/files?url=...
export const getGithubFiles = async (req, res, next) => {
  try {
    const parsed = parseUrlParam(req, res);
    if (!parsed) return;

    const path = req.query.path || '';
    const files = await getRepositoryContents(parsed.owner, parsed.repo, path);

    res.status(200).json({
      success: true,
      files
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// @desc    Get GitHub repository contributors
// @route   GET /api/github/contributors?url=...
export const getGithubContributors = async (req, res, next) => {
  try {
    const parsed = parseUrlParam(req, res);
    if (!parsed) return;

    const contributors = await getContributors(parsed.owner, parsed.repo);

    res.status(200).json({
      success: true,
      contributors
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// @desc    Get GitHub repository recent commits (latest 20)
// @route   GET /api/github/commits?url=...
export const getGithubCommits = async (req, res, next) => {
  try {
    const parsed = parseUrlParam(req, res);
    if (!parsed) return;

    const commits = await getCommits(parsed.owner, parsed.repo, 20);

    res.status(200).json({
      success: true,
      commits
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};
