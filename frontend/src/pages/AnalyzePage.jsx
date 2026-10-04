import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Sparkles, AlertCircle, BrainCircuit } from 'lucide-react';
import GithubIcon from '../components/GithubIcon';
import { analyzeGithubRepository } from '../services/api';

const AnalyzePage = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('Fetching repository data & invoking Gemini AI...');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const exampleRepos = [
    'https://github.com/facebook/react',
    'https://github.com/vercel/next.js',
    'https://github.com/expressjs/express',
    'https://github.com/tailwindlabs/tailwindcss'
  ];

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!repoUrl || !repoUrl.trim()) {
      setError('Please enter a valid GitHub repository URL.');
      return;
    }

    setError('');
    setLoading(true);
    setStatusText('Fetching repository structure from GitHub REST API...');

    try {
      setTimeout(() => {
        setStatusText('Invoking Google Gemini AI for architecture review...');
      }, 1200);

      const res = await analyzeGithubRepository(repoUrl.trim());
      setLoading(false);

      if (res.success && res.analysis) {
        navigate(`/repository/analysis?url=${encodeURIComponent(repoUrl.trim())}`, {
          state: { analysisData: res, repoUrl: repoUrl.trim() }
        });
      } else {
        setError(res.message || 'Failed to complete AI repository analysis.');
      }
    } catch (err) {
      setLoading(false);
      const apiMessage = err.response?.data?.message || err.message || 'Error connecting to AI analysis API.';
      setError(apiMessage);
    }
  };

  const selectExample = (url) => {
    setRepoUrl(url);
    setError('');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8 py-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini AI Repository Analysis
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Analyze Any GitHub Repository
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Paste a public GitHub link to run an automated architectural audit, technology verification, security check, and code quality review powered by Google Gemini AI.
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <Input
              label="GitHub Repository URL"
              type="url"
              icon={GithubIcon}
              placeholder="https://github.com/facebook/react"
              value={repoUrl}
              onChange={(e) => {
                setRepoUrl(e.target.value);
                if (error) setError('');
              }}
              error={error}
              required
            />

            {error && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-medium">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              icon={BrainCircuit}
              className="w-full"
            >
              Analyze Repository with AI
            </Button>
          </form>

          {/* Examples Quick Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Try an Example Repository:</span>
            <div className="flex flex-wrap gap-2">
              {exampleRepos.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => selectExample(url)}
                  className="text-xs bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-cyan-400 px-3 py-1.5 rounded-lg transition-colors font-mono"
                >
                  {url.replace('https://github.com/', '')}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Loading Overlay Preview */}
        {loading && (
          <Card className="text-center p-8 bg-slate-900/90 border border-cyan-500/30 shadow-2xl space-y-3">
            <LoadingSpinner size="lg" text={statusText} />
            <p className="text-xs text-slate-500 font-mono">
              Extracting file tree, technology signatures, documentation snippets & generating evidence-backed insights...
            </p>
          </Card>
        )}

        {/* Informational Guidance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-1">
            <span className="font-semibold text-slate-200 block">Evidence-Based Insights</span>
            <p>Every technology and pattern identified is backed by explicit evidence found in repository metadata.</p>
          </div>
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-1">
            <span className="font-semibold text-slate-200 block">Structured Architecture Audit</span>
            <p>Generates actionable recommendations for code quality, test coverage, and documentation improvements.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyzePage;
