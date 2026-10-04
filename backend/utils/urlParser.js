/**
 * Utility to parse GitHub repository URLs
 * Input: https://github.com/facebook/react (or with .git, trailing slashes, etc.)
 * Output: { isValid: true, owner: "facebook", repo: "react" }
 * Or: { isValid: false, error: "Detailed error message" }
 */
export const parseGithubUrl = (urlInput) => {
  if (!urlInput || typeof urlInput !== 'string') {
    return {
      isValid: false,
      error: 'Repository URL is required'
    };
  }

  let trimmedUrl = urlInput.trim();

  // Prepend https:// if user omitted protocol (e.g. github.com/owner/repo)
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    trimmedUrl = `https://${trimmedUrl}`;
  }

  try {
    const parsedUrl = new URL(trimmedUrl);
    const hostname = parsedUrl.hostname.toLowerCase();

    if (hostname !== 'github.com' && hostname !== 'www.github.com') {
      return {
        isValid: false,
        error: 'URL must be a valid GitHub link (e.g. https://github.com/owner/repo)'
      };
    }

    // Split pathname into clean segments
    const pathParts = parsedUrl.pathname
      .split('/')
      .filter((part) => part.length > 0);

    if (pathParts.length < 2) {
      if (pathParts.length === 1) {
        return {
          isValid: false,
          error: 'URL provided is a GitHub user profile. Please provide a repository URL (e.g. https://github.com/owner/repo)'
        };
      }
      return {
        isValid: false,
        error: 'Incomplete GitHub repository URL. Expected format: https://github.com/owner/repository'
      };
    }

    const owner = pathParts[0];
    let repo = pathParts[1];

    // Strip trailing .git extension if present
    if (repo.endsWith('.git')) {
      repo = repo.slice(0, -4);
    }

    if (!owner || !repo) {
      return {
        isValid: false,
        error: 'Invalid GitHub repository URL parameters'
      };
    }

    return {
      isValid: true,
      owner,
      repo
    };
  } catch (e) {
    return {
      isValid: false,
      error: 'Invalid URL syntax provided'
    };
  }
};

/**
 * Normalizes a GitHub repository URL into standard format: https://github.com/owner/repo
 */
export const normalizeGithubUrl = (urlInput) => {
  if (!urlInput) return '';
  const parsed = parseGithubUrl(urlInput);
  if (!parsed.isValid) return urlInput.trim().toLowerCase();
  return `https://github.com/${parsed.owner.toLowerCase()}/${parsed.repo.toLowerCase()}`;
};

