import mongoose from 'mongoose';
import {
  saveRepository,
  getRepositoryById as findRepoById,
  getAllRepositories,
  deleteRepository as removeRepoById
} from '../services/repositoryService.js';

// @desc    Create or update a saved repository analysis
// @route   POST /api/repositories
// @access  Private
export const createRepository = async (req, res, next) => {
  try {
    const { githubUrl, url, owner, name, fullName } = req.body;
    const targetUrl = githubUrl || url;

    if (!targetUrl && (!owner || !name) && !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: githubUrl or owner & name are required'
      });
    }

    const userId = req.user?._id;
    const repository = await saveRepository(req.body, userId);

    res.status(200).json({
      success: true,
      data: repository,
      repository
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all analyzed repositories belonging to current user (newest first)
// @route   GET /api/repositories
// @access  Private
export const getRepositories = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const repositories = await getAllRepositories(userId);

    res.status(200).json({
      success: true,
      count: repositories.length,
      data: repositories,
      repositories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single repository by MongoDB ID for the current user
// @route   GET /api/repositories/:id
// @access  Private
export const getRepositoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid repository ID format'
      });
    }

    const repository = await findRepoById(id, userId);

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    res.status(200).json({
      success: true,
      data: repository,
      repository
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete repository by MongoDB ID for the current user
// @route   DELETE /api/repositories/:id
// @access  Private
export const deleteRepository = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid repository ID format'
      });
    }

    const repository = await removeRepoById(id, userId);

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Repository deleted successfully',
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};
