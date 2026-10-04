import { parseGithubUrl, normalizeGithubUrl } from '../utils/urlParser.js';
import {
  getRepository,
  getLanguages,
  getRepositoryContents,
  getCommits,
  getReadme
} from '../services/githubService.js';
import { analyzeRepositoryWithGemini, testGeminiConnection } from '../services/geminiService.js';
import { saveRepository } from '../services/repositoryService.js';

// @desc    Test connection to Gemini API
// @route   GET /api/ai/test
export const testGemini = async (req, res, next) => {
  try {
    await testGeminiConnection();
    return res.status(200).json({
      success: true,
      message: 'Gemini API connected successfully'
    });
  } catch (error) {
    const rawMsg = error.message || 'Gemini API connection test failed';
    const safeMsg = rawMsg
      .replace(/(AIzaSy[a-zA-Z0-9_-]{33})/g, '[REDACTED_GEMINI_KEY]')
      .replace(/key=[^&\s]+/gi, 'key=[REDACTED]');

    return res.status(error.statusCode || 500).json({
      success: false,
      message: safeMsg
    });
  }
};

// @desc    Analyze GitHub Repository using Gemini AI & save result to MongoDB
// @route   POST /api/ai/analyze

export const analyzeRepository = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Missing required request body field: url'
      });
    }

    const parsed = parseGithubUrl(url);
    if (!parsed.isValid) {
      return res.status(400).json({
        success: false,
        message: parsed.error
      });
    }

    const normalizedUrl = normalizeGithubUrl(url);

    // 1. Retrieve GitHub data package safely in parallel
    const [repoInfo, languages, files, commits, readme] = await Promise.all([
      getRepository(parsed.owner, parsed.repo),
      getLanguages(parsed.owner, parsed.repo),
      getRepositoryContents(parsed.owner, parsed.repo),
      getCommits(parsed.owner, parsed.repo, 10),
      getReadme(parsed.owner, parsed.repo)
    ]);

    const repoPackage = {
      ...repoInfo,
      languages,
      files,
      commits,
      readme
    };

    // 2. Invoke Gemini AI Analysis
    const analysis = await analyzeRepositoryWithGemini(repoPackage);

    // 3. Save or update repository record + AI analysis in MongoDB
    let savedRepository = null;
    try {
      const userId = req.user?._id;
      savedRepository = await saveRepository({
        githubUrl: normalizedUrl,
        owner: repoInfo.owner,
        name: repoInfo.name,
        fullName: repoInfo.full_name,
        description: repoInfo.description || '',
        defaultBranch: repoInfo.default_branch || 'main',
        stars: repoInfo.stargazers_count || 0,
        forks: repoInfo.forks_count || 0,
        openIssues: repoInfo.open_issues_count || 0,
        language: repoInfo.language || '',
        languages: languages || {},
        topics: repoInfo.topics || [],
        license: typeof repoInfo.license === 'string' ? repoInfo.license : (repoInfo.license?.name || ''),
        readme: readme || '',
        fileStructure: files || [],
        githubData: repoPackage,
        aiAnalysis: analysis
      }, userId);
    } catch (dbError) {
      console.error('Warning: Could not save repository analysis to MongoDB:', dbError.message);
    }

    const responseData = savedRepository ? savedRepository.toObject() : {
      githubUrl: normalizedUrl,
      owner: repoInfo.owner,
      name: repoInfo.name,
      fullName: repoInfo.full_name,
      description: repoInfo.description,
      stars: repoInfo.stargazers_count,
      forks: repoInfo.forks_count,
      language: repoInfo.language,
      aiAnalysis: analysis
    };

    res.status(200).json({
      success: true,
      url: normalizedUrl,
      data: responseData,
      repository: responseData,
      analysis: analysis
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
