import { GoogleGenAI } from '@google/genai';

/**
 * Redacts potential credentials or sensitive tokens from strings
 */
const sanitizeText = (text) => {
  if (typeof text !== 'string') return text;
  return text
    .replace(/(ghp_[a-zA-Z0-9]{36})/g, '[REDACTED_GITHUB_TOKEN]')
    .replace(/(gho_[a-zA-Z0-9]{36})/g, '[REDACTED_GITHUB_TOKEN]')
    .replace(/(github_pat_[a-zA-Z0-9_]{82})/g, '[REDACTED_GITHUB_PAT]')
    .replace(/(AIzaSy[a-zA-Z0-9_-]{33})/g, '[REDACTED_GEMINI_KEY]')
    .replace(/(sk-[a-zA-Z0-9]{32,48})/g, '[REDACTED_SECRET_KEY]');
};

/**
 * Validates and ensures all required fields exist in the parsed AI JSON response.
 */
const sanitizeAnalysisResponse = (data) => {
  return {
    projectOverview: {
      summary: data?.projectOverview?.summary || 'Insufficient repository information to determine summary.',
      purpose: data?.projectOverview?.purpose || 'Insufficient repository information to determine purpose.',
      targetUsers: data?.projectOverview?.targetUsers || 'Insufficient repository information to determine target users.'
    },
    technologyStack: Array.isArray(data?.technologyStack) ? data.technologyStack.map(item => ({
      technology: item?.technology || 'Unknown',
      category: item?.category || 'General',
      evidence: item?.evidence || 'Inferred from repository metadata'
    })) : [],
    architecture: {
      type: data?.architecture?.type || 'Standard Repository Architecture',
      components: Array.isArray(data?.architecture?.components) ? data.architecture.components : [],
      dataFlow: data?.architecture?.dataFlow || 'Insufficient repository information to determine data flow.'
    },
    repositoryStructure: Array.isArray(data?.repositoryStructure) ? data.repositoryStructure.map(item => ({
      path: item?.path || '',
      description: item?.description || ''
    })) : [],
    documentationAnalysis: {
      quality: data?.documentationAnalysis?.quality || 'Moderate',
      strengths: Array.isArray(data?.documentationAnalysis?.strengths) ? data.documentationAnalysis.strengths : [],
      improvements: Array.isArray(data?.documentationAnalysis?.improvements) ? data.documentationAnalysis.improvements : []
    },
    testingAnalysis: {
      observations: Array.isArray(data?.testingAnalysis?.observations) ? data.testingAnalysis.observations : [],
      recommendations: Array.isArray(data?.testingAnalysis?.recommendations) ? data.testingAnalysis.recommendations : []
    },
    securityObservations: Array.isArray(data?.securityObservations) ? data.securityObservations.map(item => ({
      issue: item?.issue || 'General Security Observation',
      severity: item?.severity || 'Informational',
      recommendation: item?.recommendation || 'Follow standard security best practices'
    })) : [],
    codeQualityObservations: Array.isArray(data?.codeQualityObservations) ? data.codeQualityObservations.map(item => ({
      observation: item?.observation || '',
      recommendation: item?.recommendation || ''
    })) : [],
    improvements: Array.isArray(data?.improvements) ? data.improvements.map(item => ({
      area: item?.area || 'General',
      suggestion: item?.suggestion || '',
      reason: item?.reason || ''
    })) : []
  };
};

/**
 * Analyzes repository data using Google Gemini API
 */
export const analyzeRepositoryWithGemini = async (repoPackage) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    const error = new Error('GEMINI_API_KEY is missing in backend environment variables. Please add GEMINI_API_KEY to your backend .env file.');
    error.statusCode = 500;
    throw error;
  }

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
  const fallbackModels = [primaryModel, 'gemini-3.1-flash-lite', 'gemini-3-flash-preview', 'gemini-flash-lite-latest', 'gemini-3.6-flash'];
  const candidateModels = Array.from(new Set(fallbackModels));
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

  const systemInstruction = `You are a Senior Software Engineer and Software Architecture Reviewer.
Your task is to analyze the provided GitHub repository metadata and return a structured JSON evaluation.

STRICT RULES TO FOLLOW:
1. Analyze ONLY the information provided. Do NOT invent repository facts or guess technologies unless explicitly supported by repository data.
2. Clearly distinguish observed facts from recommendations.
3. If information is unavailable or insufficient, explicitly write: "Insufficient repository information to determine this."
4. Do NOT generate a single overall score or numerical rating for the repository.
5. Do NOT expose secrets, credentials, or private API keys.
6. Keep recommendations practical and actionable.
7. Return ONLY a single valid JSON object matching the requested schema without conversational commentary.`;

  const cleanedReadme = sanitizeText(repoPackage.readme || 'No README available');
  const cleanedDescription = sanitizeText(repoPackage.description || 'No description provided');
  const cleanedCommits = (repoPackage.commits || []).slice(0, 10).map(c => `- ${sanitizeText(c.message.split('\n')[0])} (by ${c.author})`).join('\n');

  const userPrompt = `Analyze the following GitHub repository package and produce a detailed architectural evaluation:

=== REPOSITORY METADATA ===
Name: ${repoPackage.name}
Full Name: ${repoPackage.full_name}
Owner: ${repoPackage.owner?.login || 'Unknown'}
Description: ${cleanedDescription}
Primary Language: ${repoPackage.language || 'N/A'}
Default Branch: ${repoPackage.default_branch || 'main'}
Stars: ${repoPackage.stargazers_count || 0}
Forks: ${repoPackage.forks_count || 0}
Open Issues: ${repoPackage.open_issues_count || 0}
Topics: ${(repoPackage.topics || []).join(', ')}

=== PROGRAMMING LANGUAGES (BYTES) ===
${JSON.stringify(repoPackage.languages || {})}

=== TOP-LEVEL FILE & DIRECTORY STRUCTURE ===
${(repoPackage.files || []).map(f => `- ${f.name} (${f.type})`).join('\n')}

=== RECENT COMMIT MESSAGES ===
${cleanedCommits || 'No recent commits available'}

=== README CONTENT SNIPPET ===
${cleanedReadme}

RETURN ONLY A VALID JSON OBJECT MATCHING THIS EXACT SCHEMA:
{
  "projectOverview": {
    "summary": "...",
    "purpose": "...",
    "targetUsers": "..."
  },
  "technologyStack": [
    { "technology": "...", "category": "...", "evidence": "..." }
  ],
  "architecture": {
    "type": "...",
    "components": ["..."],
    "dataFlow": "..."
  },
  "repositoryStructure": [
    { "path": "...", "description": "..." }
  ],
  "documentationAnalysis": {
    "quality": "...",
    "strengths": ["..."],
    "improvements": ["..."]
  },
  "testingAnalysis": {
    "observations": ["..."],
    "recommendations": ["..."]
  },
  "securityObservations": [
    { "issue": "...", "severity": "...", "recommendation": "..." }
  ],
  "codeQualityObservations": [
    { "observation": "...", "recommendation": "..." }
  ],
  "improvements": [
    { "area": "...", "suggestion": "...", "reason": "..." }
  ]
}`;

  let lastError = null;
  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json'
        }
      });

      let rawText = response.text || '';
      rawText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();

      if (!rawText) {
        throw new Error('Gemini API returned an empty response.');
      }

      const parsedData = JSON.parse(rawText);
      return sanitizeAnalysisResponse(parsedData);
    } catch (err) {
      lastError = err;
      const msg = err.message || '';
      if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand') || msg.includes('404') || msg.includes('NOT_FOUND')) {
        console.warn(`[Gemini Service] Model ${modelName} returned temporary error (${msg}). Trying next fallback model...`);
        continue;
      }
      break;
    }
  }

  const err = lastError;
  if (err) {
    if (err instanceof SyntaxError) {
      const parseErr = new Error('AI analysis failed due to malformed JSON output from Gemini API. Please try again.');
      parseErr.statusCode = 502;
      throw parseErr;
    }
    if (err.status || err.statusCode) {
      throw err;
    }
    const msg = err.message || '';
    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
      const keyErr = new Error('Invalid Gemini API Key provided. Please check the GEMINI_API_KEY in backend .env.');
      keyErr.statusCode = 401;
      throw keyErr;
    }
    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('429')) {
      const quotaErr = new Error('Gemini API rate limit or quota exceeded. Please try again later.');
      quotaErr.statusCode = 429;
      throw quotaErr;
    }
    const apiErr = new Error(err.message || 'Gemini API call failed.');
    apiErr.statusCode = 500;
    throw apiErr;
  }
};

/**
 * Tests connection to Google Gemini API with a small prompt
 */
export const testGeminiConnection = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    const error = new Error('GEMINI_API_KEY is missing in backend environment variables.');
    error.statusCode = 500;
    throw error;
  }

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
  const candidateModels = Array.from(new Set([primaryModel, 'gemini-3.1-flash-lite', 'gemini-3-flash-preview', 'gemini-flash-lite-latest', 'gemini-3.6-flash']));
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

  let lastError = null;
  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: 'Hello! Respond with "OK" if connected.'
      });

      if (!response || !response.text) {
        throw new Error('Gemini API returned an empty response.');
      }

      return true;
    } catch (err) {
      lastError = err;
      const msg = err.message || '';
      if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand') || msg.includes('404') || msg.includes('NOT_FOUND')) {
        continue;
      }
      break;
    }
  }

  const err = lastError;
  if (err) {
    if (err.status || err.statusCode) {
      throw err;
    }
    const msg = err.message || '';
    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
      const keyErr = new Error('Invalid Gemini API Key provided.');
      keyErr.statusCode = 401;
      throw keyErr;
    }
    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('429')) {
      const quotaErr = new Error('Gemini API rate limit or quota exceeded.');
      quotaErr.statusCode = 429;
      throw quotaErr;
    }
    const apiErr = new Error(err.message || 'Gemini API test call failed.');
    apiErr.statusCode = 500;
    throw apiErr;
  }
};



