import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

const getHeaders = () => {
  const headers = {
    'User-Agent': 'AI-GitHub-Project-Analyzer',
    'Accept': 'application/vnd.github.v3+json'
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
};

// Helper for handling GitHub API errors cleanly
const handleGithubError = (error, resourceName = 'repository') => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || '';

    if (status === 404) {
      const customErr = new Error(`GitHub ${resourceName} not found or is private`);
      customErr.statusCode = 404;
      throw customErr;
    }
    if (status === 403) {
      if (message.includes('rate limit')) {
        const rateLimitErr = new Error('GitHub API rate limit exceeded. Please add a GITHUB_TOKEN in backend .env to increase rate limits.');
        rateLimitErr.statusCode = 429;
        throw rateLimitErr;
      }
      const forbiddenErr = new Error('Access forbidden to GitHub repository (may be private or restricted)');
      forbiddenErr.statusCode = 403;
      throw forbiddenErr;
    }

    const genericErr = new Error(message || `GitHub API returned error ${status}`);
    genericErr.statusCode = status;
    throw genericErr;
  } else if (error.request) {
    const networkErr = new Error('Network error connecting to GitHub API');
    networkErr.statusCode = 503;
    throw networkErr;
  } else {
    throw error;
  }
};

/**
 * Fetch basic repository metadata
 */
export const getRepository = async (owner, repo) => {
  try {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
    const response = await axios.get(url, { headers: getHeaders(), timeout: 10000 });
    const data = response.data;

    return {
      name: data.name,
      full_name: data.full_name,
      owner: {
        login: data.owner?.login,
        avatar_url: data.owner?.avatar_url,
        html_url: data.owner?.html_url
      },
      description: data.description || '',
      html_url: data.html_url,
      default_branch: data.default_branch || 'main',
      language: data.language || 'N/A',
      languages_url: data.languages_url,
      stargazers_count: data.stargazers_count || 0,
      forks_count: data.forks_count || 0,
      open_issues_count: data.open_issues_count || 0,
      watchers_count: data.watchers_count || 0,
      created_at: data.created_at,
      updated_at: data.updated_at,
      pushed_at: data.pushed_at,
      topics: data.topics || []
    };
  } catch (error) {
    handleGithubError(error, 'repository');
  }
};

/**
 * Fetch programming languages byte distribution
 */
export const getLanguages = async (owner, repo) => {
  try {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`;
    const response = await axios.get(url, { headers: getHeaders(), timeout: 10000 });
    return response.data || {};
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {};
    }
    handleGithubError(error, 'languages');
  }
};

/**
 * Fetch top-level or specified path contents/files
 */
export const getRepositoryContents = async (owner, repo, path = '') => {
  try {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${cleanPath}`;
    const response = await axios.get(url, { headers: getHeaders(), timeout: 10000 });

    if (!Array.isArray(response.data)) {
      const item = response.data;
      return [{
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size,
        download_url: item.download_url
      }];
    }

    return response.data.map((item) => ({
      name: item.name,
      path: item.path,
      type: item.type,
      size: item.size
    }));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    handleGithubError(error, 'contents');
  }
};

/**
 * Fetch README file content (if available)
 */
export const getReadme = async (owner, repo) => {
  try {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`;
    const response = await axios.get(url, { headers: getHeaders(), timeout: 10000 });
    if (response.data && response.data.content) {
      const decoded = Buffer.from(response.data.content, 'base64').toString('utf-8');
      // Truncate README content safely to max 3500 chars to avoid prompt bloat
      return decoded.slice(0, 3500);
    }
    return 'No README content available.';
  } catch (error) {
    return 'README unavailable or not found.';
  }
};

/**
 * Fetch repository top contributors
 */
export const getContributors = async (owner, repo) => {
  try {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=15`;
    const response = await axios.get(url, { headers: getHeaders(), timeout: 10000 });

    if (!Array.isArray(response.data)) return [];

    return response.data.map((user) => ({
      username: user.login,
      contributions: user.contributions,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url
    }));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    handleGithubError(error, 'contributors');
  }
};

/**
 * Fetch recent commits (default latest 20)
 */
export const getCommits = async (owner, repo, perPage = 20) => {
  try {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=${perPage}`;
    const response = await axios.get(url, { headers: getHeaders(), timeout: 10000 });

    if (!Array.isArray(response.data)) return [];

    return response.data.map((item) => ({
      sha: item.sha,
      author: item.commit?.author?.name || item.author?.login || 'Unknown',
      message: item.commit?.message || '',
      date: item.commit?.author?.date || item.commit?.committer?.date,
      url: item.html_url
    }));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    handleGithubError(error, 'commits');
  }
};

