import Repository from '../models/Repository.js';
import { parseGithubUrl, normalizeGithubUrl } from '../utils/urlParser.js';

/**
 * Save or update an analyzed repository document in MongoDB associated with a user.
 * Prevents duplicates per user by matching normalized githubUrl or fullName.
 */
export const saveRepository = async (repoData, userId = null) => {
  const targetUserId = userId || repoData.user || repoData.userId;
  const rawUrl = repoData.githubUrl || repoData.url || (repoData.owner && repoData.name ? `https://github.com/${repoData.owner}/${repoData.name}` : '');
  const normalizedUrl = normalizeGithubUrl(rawUrl);

  const owner = repoData.owner || '';
  const name = repoData.name || '';
  const fullName = repoData.fullName || (owner && name ? `${owner}/${name}` : '');

  const updateFields = {
    user: targetUserId,
    githubUrl: normalizedUrl,
    owner,
    name,
    fullName,
    description: repoData.description || '',
    defaultBranch: repoData.defaultBranch || 'main',
    stars: typeof repoData.stars === 'number' ? repoData.stars : (repoData.stargazers_count || 0),
    forks: typeof repoData.forks === 'number' ? repoData.forks : (repoData.forks_count || 0),
    openIssues: typeof repoData.openIssues === 'number' ? repoData.openIssues : (repoData.open_issues_count || 0),
    language: repoData.language || '',
    languages: repoData.languages || {},
    topics: Array.isArray(repoData.topics) ? repoData.topics : [],
    license: typeof repoData.license === 'string' ? repoData.license : (repoData.license?.name || ''),
    readme: repoData.readme || '',
    fileStructure: repoData.fileStructure || repoData.files || [],
    githubData: repoData.githubData || {},
    aiAnalysis: repoData.aiAnalysis || {},
    analyzedAt: new Date()
  };

  // Find existing repo for this user by normalized URL or fullName
  let existingRepo = null;
  const queryFilter = {};
  if (targetUserId) {
    queryFilter.user = targetUserId;
  }

  if (normalizedUrl) {
    existingRepo = await Repository.findOne({ ...queryFilter, githubUrl: normalizedUrl });
  }
  if (!existingRepo && fullName) {
    existingRepo = await Repository.findOne({ ...queryFilter, fullName });
  }

  if (existingRepo) {
    Object.assign(existingRepo, updateFields);
    return await existingRepo.save();
  } else {
    const repository = new Repository(updateFields);
    return await repository.save();
  }
};

/**
 * Find repository by GitHub URL (normalized) or fullName for a user
 */
export const getRepositoryByUrl = async (url, userId = null) => {
  if (!url) return null;
  const normalizedUrl = normalizeGithubUrl(url);
  const parsed = parseGithubUrl(url);

  const queryConditions = [{ githubUrl: normalizedUrl }];
  if (parsed.isValid) {
    queryConditions.push({ fullName: `${parsed.owner}/${parsed.repo}` });
  }

  const filter = { $or: queryConditions };
  if (userId) {
    filter.user = userId;
  }

  return await Repository.findOne(filter);
};

/**
 * Find repository by MongoDB ID (scoped to user if userId is provided)
 */
export const getRepositoryById = async (id, userId = null) => {
  const filter = { _id: id };
  if (userId) {
    filter.user = userId;
  }
  return await Repository.findOne(filter);
};

/**
 * Fetch all repositories for a user, sorted by analyzedAt: newest first
 */
export const getAllRepositories = async (userId = null) => {
  const filter = userId ? { user: userId } : {};
  return await Repository.find(filter).sort({ analyzedAt: -1, createdAt: -1 });
};

/**
 * Delete repository by MongoDB ID (scoped to user)
 */
export const deleteRepository = async (id, userId = null) => {
  const filter = { _id: id };
  if (userId) {
    filter.user = userId;
  }
  return await Repository.findOneAndDelete(filter);
};
