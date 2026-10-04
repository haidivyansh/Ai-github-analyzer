import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { analyzeGithubRepository, getSavedRepositoryById, deleteSavedRepository } from '../services/api';
import {
  BrainCircuit,
  Layers,
  Code2,
  ShieldCheck,
  FileText,
  TestTube,
  Lightbulb,
  FolderTree,
  AlertTriangle,
  ArrowLeft,
  Info,
  ExternalLink,
  Trash2
} from 'lucide-react';

const AIAnalysisPage = () => {
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const id = routeId || searchParams.get('id');
  const repoUrl = searchParams.get('url') || location.state?.repoUrl || 'https://github.com/facebook/react';

  const [loading, setLoading] = useState(!location.state?.analysisData);
  const [error, setError] = useState('');
  const [data, setData] = useState(location.state?.analysisData || null);

  useEffect(() => {
    let isMounted = true;
    if (location.state?.analysisData) {
      setData(location.state.analysisData);
      setLoading(false);
      return;
    }

    const fetchSavedAnalysis = async (targetId) => {
      setLoading(true);
      setError('');
      try {
        const res = await getSavedRepositoryById(targetId);
        if (isMounted) {
          if (res.success && res.repository && res.repository.aiAnalysis) {
            setData({
              repository: res.repository,
              analysis: res.repository.aiAnalysis,
              url: res.repository.githubUrl
            });
          } else {
            setError('Repository analysis record not found in database.');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch analysis from database.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const runFreshAnalysis = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await analyzeGithubRepository(repoUrl);
        if (isMounted) {
          if (res.success && res.analysis) {
            setData(res);
          } else {
            setError(res.message || 'Failed to complete AI repository analysis.');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Error executing Gemini AI repository analysis.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id && id !== 'analysis') {
      fetchSavedAnalysis(id);
    } else {
      runFreshAnalysis();
    }

    return () => { isMounted = false; };
  }, [id, repoUrl, location.state]);

  const handleDelete = async () => {
    const mongoId = data?.repository?._id || id;
    if (!mongoId) return;

    if (window.confirm(`Are you sure you want to delete this repository analysis from MongoDB?`)) {
      try {
        const res = await deleteSavedRepository(mongoId);
        if (res.success) {
          navigate('/dashboard');
        } else {
          alert(res.message || 'Failed to delete repository');
        }
      } catch (err) {
        alert(err.response?.data?.message || err.message || 'Error deleting repository');
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <LoadingSpinner size="lg" text={id ? 'Fetching saved AI report from MongoDB...' : 'Gemini AI is analyzing repository structure and architecture...'} />
          <p className="text-xs text-slate-500 font-mono max-w-md text-center">
            Parsing file tree, documentation snippets, commit logs, and technology signatures for {id || repoUrl}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data || !data.analysis) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12 space-y-6 text-center">
          <Card className="p-8 space-y-4 border-rose-500/30 bg-rose-950/20">
            <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">AI Analysis Error</h2>
            <p className="text-sm text-rose-300">{error || 'Unable to load AI analysis data.'}</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const { repository, analysis } = data;
  const mongoId = repository?._id || id;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Navigation & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4" />
              Gemini AI Repository Evaluation
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              Analysis Report: {repository?.fullName || repository?.full_name || repository?.name || repoUrl}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={mongoId ? `/repository/${mongoId}` : `/repository/details?url=${encodeURIComponent(repoUrl)}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              <span>View Repository Specs</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </Link>

            {mongoId && (
              <Button
                variant="outline"
                size="sm"
                icon={Trash2}
                onClick={handleDelete}
                className="text-rose-400 hover:text-rose-300 border-rose-500/30 hover:bg-rose-950/40"
              >
                Delete Analysis
              </Button>
            )}
          </div>
        </div>

        {/* 1. Project Overview */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-lg border-b border-slate-800 pb-3">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <h2>Project Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">Summary</span>
              <p className="text-slate-300 text-xs leading-relaxed">{analysis.projectOverview?.summary}</p>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">Primary Purpose</span>
              <p className="text-slate-300 text-xs leading-relaxed">{analysis.projectOverview?.purpose}</p>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Target Audience</span>
              <p className="text-slate-300 text-xs leading-relaxed">{analysis.projectOverview?.targetUsers}</p>
            </div>
          </div>
        </Card>

        {/* 2. Technology Stack (Evidence-Based) */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-lg">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <h2>Verified Technology Stack</h2>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
              Evidence-Based Identification
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.technologyStack && analysis.technologyStack.length > 0 ? (
              analysis.technologyStack.map((tech, idx) => (
                <div key={idx} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{tech.technology}</span>
                    <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                      {tech.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-start gap-1.5 pt-1 border-t border-slate-800/80">
                    <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-300">Evidence:</strong> {tech.evidence}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Insufficient repository information to determine technology stack.</p>
            )}
          </div>
        </Card>

        {/* 3. Architecture Pattern & Data Flow */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-lg border-b border-slate-800 pb-3">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2>Architecture & System Design</h2>
          </div>
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold uppercase block mb-1">Architecture Style</span>
              <span className="inline-block px-3 py-1 bg-slate-800 text-cyan-400 font-bold font-mono rounded-lg border border-slate-700">
                {analysis.architecture?.type}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold uppercase block mb-2">Core Identified Components</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {(analysis.architecture?.components || []).map((comp, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 font-medium text-slate-200">
                    • {comp}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase block">Data Flow Description</span>
              <p className="text-slate-300 leading-relaxed">{analysis.architecture?.dataFlow}</p>
            </div>
          </div>
        </Card>

        {/* 4. Repository Structure & Key Directory Map */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-lg border-b border-slate-800 pb-3">
            <FolderTree className="w-5 h-5 text-cyan-400" />
            <h2>Repository Structure Map</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(analysis.repositoryStructure || []).map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs flex flex-col justify-between space-y-1">
                <span className="font-mono font-bold text-cyan-300">{item.path}</span>
                <span className="text-slate-400">{item.description}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 5. Code Quality & Testing & Documentation Observations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Code Quality Observations */}
          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-base border-b border-slate-800 pb-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <h3>Code Quality Observations</h3>
            </div>
            <div className="space-y-3 text-xs">
              {(analysis.codeQualityObservations || []).map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <p className="text-slate-200 font-medium">{item.observation}</p>
                  {item.recommendation && (
                    <p className="text-cyan-400 text-[11px]"><strong>Tip:</strong> {item.recommendation}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Documentation Analysis */}
          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-base border-b border-slate-800 pb-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <h3>Documentation Audit</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-800/60">
                <span className="text-slate-400">Quality Rating</span>
                <span className="font-bold text-purple-300">{analysis.documentationAnalysis?.quality}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Strengths:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {(analysis.documentationAnalysis?.strengths || []).map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Testing Analysis */}
          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-base border-b border-slate-800 pb-2">
              <TestTube className="w-4 h-4 text-emerald-400" />
              <h3>Testing Analysis</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Observations:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {(analysis.testingAnalysis?.observations || []).map((obs, idx) => (
                    <li key={idx}>{obs}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* 6. Security Observations */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-lg border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2>Security Observations</h2>
          </div>
          <div className="space-y-3">
            {(analysis.securityObservations || []).map((sec, idx) => (
              <div key={idx} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 text-sm">{sec.issue}</span>
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                    sec.severity === 'High' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' :
                    sec.severity === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {sec.severity} Severity
                  </span>
                </div>
                <p className="text-slate-400"><strong className="text-slate-300">Recommendation:</strong> {sec.recommendation}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 7. Actionable Improvement Suggestions */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-lg border-b border-slate-800 pb-3">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h2>AI Improvement Suggestions</h2>
          </div>
          <div className="space-y-3">
            {(analysis.improvements || []).map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 text-sm">{item.suggestion}</span>
                  <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[11px]">
                    Area: {item.area}
                  </span>
                </div>
                <p className="text-slate-400"><strong className="text-slate-300">Rationale:</strong> {item.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIAnalysisPage;
