import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import GithubIcon from '../components/GithubIcon';
import Button from '../components/Button';
import {
  getSavedRepositoryById,
  deleteSavedRepository,
  getGithubRepository,
  getGithubLanguages,
  getGithubFiles,
  getGithubContributors,
  getGithubCommits
} from '../services/api';
import {
  Star,
  GitFork,
  AlertCircle,
  ExternalLink,
  Eye,
  GitBranch,
  Code,
  Users,
  GitCommit,
  Folder,
  FileCode,
  ArrowLeft,
  Tag,
  Trash2,
  BrainCircuit
} from 'lucide-react';

const RepoDetailsPage = () => {
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const id = routeId || searchParams.get('id');
  const repoUrl = searchParams.get('url') || location.state?.repoUrl || 'https://github.com/facebook/react';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [repo, setRepo] = useState(location.state?.repository || null);
  const [languages, setLanguages] = useState(null);
  const [files, setFiles] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [commits, setCommits] = useState([]);
  const [isSavedDb, setIsSavedDb] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSavedRepo = async (targetId) => {
      setLoading(true);
      setError('');
      try {
        const res = await getSavedRepositoryById(targetId);
        if (isMounted && res.success && res.repository) {
          const dbData = res.repository;
          setRepo({
            _id: dbData._id,
            id: dbData._id,
            name: dbData.name,
            fullName: dbData.fullName,
            owner: { login: dbData.owner },
            description: dbData.description,
            html_url: dbData.githubUrl || `https://github.com/${dbData.fullName}`,
            stargazers_count: dbData.stars,
            forks_count: dbData.forks,
            open_issues_count: dbData.openIssues,
            language: dbData.language,
            default_branch: dbData.defaultBranch || 'main',
            topics: dbData.topics || [],
            aiAnalysis: dbData.aiAnalysis
          });
          setIsSavedDb(true);

          if (dbData.languages) setLanguages(dbData.languages);
          if (dbData.fileStructure) setFiles(dbData.fileStructure);
          if (dbData.githubData?.commits) setCommits(dbData.githubData.commits);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Failed to load repository from MongoDB');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fetchGithubRepo = async (targetUrl) => {
      setLoading(true);
      setError('');
      try {
        const repoRes = await getGithubRepository(targetUrl);
        if (isMounted && repoRes.success) {
          setRepo(repoRes.repository);
        }

        const [langRes, filesRes, contribRes, commitRes] = await Promise.allSettled([
          getGithubLanguages(targetUrl),
          getGithubFiles(targetUrl),
          getGithubContributors(targetUrl),
          getGithubCommits(targetUrl)
        ]);

        if (isMounted) {
          if (langRes.status === 'fulfilled' && langRes.value?.success) setLanguages(langRes.value.languages);
          if (filesRes.status === 'fulfilled' && filesRes.value?.success) setFiles(filesRes.value.files);
          if (contribRes.status === 'fulfilled' && contribRes.value?.success) setContributors(contribRes.value.contributors);
          if (commitRes.status === 'fulfilled' && commitRes.value?.success) setCommits(commitRes.value.commits);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch GitHub repository details');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id && id !== 'details') {
      fetchSavedRepo(id);
    } else {
      fetchGithubRepo(repoUrl);
    }

    return () => { isMounted = false; };
  }, [id, repoUrl]);

  const handleDelete = async () => {
    const targetId = repo?._id || id;
    if (!targetId) return;

    if (window.confirm(`Are you sure you want to delete "${repo?.fullName || repo?.name}" from saved database?`)) {
      try {
        const res = await deleteSavedRepository(targetId);
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

  if (loading && !repo) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <LoadingSpinner size="lg" text={id ? 'Loading repository from MongoDB...' : 'Fetching data from GitHub REST API...'} />
          <p className="text-xs text-slate-500 font-mono">{id || repoUrl}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !repo) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12 space-y-6 text-center">
          <Card className="p-8 space-y-4 border-rose-500/30 bg-rose-950/20">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Repository Fetch Error</h2>
            <p className="text-sm text-rose-300">{error}</p>
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

  const totalLanguageBytes = languages && typeof languages === 'object' && !Array.isArray(languages)
    ? Object.values(languages).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)
    : 0;

  const mongoId = repo?._id || id;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Back navigation & Action Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            {isSavedDb && (
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
                MongoDB Saved Record
              </span>
            )}

            {mongoId && (
              <Link to={`/repository/${mongoId}/analysis`}>
                <Button variant="primary" size="sm" icon={BrainCircuit}>
                  View Gemini AI Analysis
                </Button>
              </Link>
            )}

            {(isSavedDb || mongoId) && (
              <Button variant="outline" size="sm" icon={Trash2} onClick={handleDelete} className="text-rose-400 hover:text-rose-300 border-rose-500/30 hover:bg-rose-950/40">
                Delete Saved Repo
              </Button>
            )}
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {repo.owner?.avatar_url ? (
                  <img
                    src={repo.owner.avatar_url}
                    alt={repo.owner.login || repo.owner}
                    className="w-12 h-12 rounded-2xl border border-slate-700 bg-slate-800 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
                    <GithubIcon className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <span>{repo.owner?.login || repo.owner || 'owner'}</span>
                    <span>/</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{repo.name}</h1>
                </div>
              </div>
              <p className="text-slate-300 text-sm sm:text-base max-w-3xl pt-1">
                {repo.aiAnalysis?.projectOverview?.summary || repo.description || 'No description provided for this repository.'}
              </p>
            </div>

            <a
              href={repo.html_url || repo.githubUrl || `https://github.com/${repo.fullName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors shrink-0 self-start md:self-center"
            >
              <span>View on GitHub</span>
              <ExternalLink className="w-4 h-4 text-cyan-400" />
            </a>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Stars</div>
                <div className="text-base font-bold text-white">{repo.stargazers_count?.toLocaleString() || repo.stars?.toLocaleString() || 0}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GitFork className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Forks</div>
                <div className="text-base font-bold text-white">{repo.forks_count?.toLocaleString() || repo.forks?.toLocaleString() || 0}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Open Issues</div>
                <div className="text-base font-bold text-white">{repo.open_issues_count?.toLocaleString() || repo.openIssues?.toLocaleString() || 0}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Watchers</div>
                <div className="text-base font-bold text-white">{(repo.watchers_count || repo.stars || 0).toLocaleString()}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Code className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Primary Language</div>
                <div className="text-base font-bold text-emerald-400">{repo.language || 'N/A'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GitBranch className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Default Branch</div>
                <div className="text-base font-bold text-indigo-400 font-mono">{repo.default_branch || repo.defaultBranch || 'main'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Topics Tag List */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400 font-semibold mr-1">Topics:</span>
            {repo.topics.map((topic, i) => (
              <span key={i} className="text-xs bg-slate-800 text-cyan-400 border border-slate-700/80 px-2.5 py-1 rounded-lg font-mono">
                #{topic}
              </span>
            ))}
          </div>
        )}

        {/* Grid for Languages & Repository Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Languages Breakdown */}
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Code className="w-4 h-4 text-cyan-400" />
              <span>Language Distribution</span>
            </h3>
            {languages && typeof languages === 'object' && Object.keys(languages).length > 0 ? (
              <div className="space-y-3">
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
                  {Object.entries(languages).map(([lang, bytes], idx) => {
                    const pct = totalLanguageBytes > 0 ? (((typeof bytes === 'number' ? bytes : 1) / totalLanguageBytes) * 100).toFixed(1) : 0;
                    const colors = ['bg-cyan-500', 'bg-purple-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500', 'bg-indigo-500'];
                    return (
                      <div
                        key={lang}
                        style={{ width: `${pct}%` }}
                        className={`h-full ${colors[idx % colors.length]}`}
                        title={`${lang}: ${pct}%`}
                      />
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {Object.entries(languages).map(([lang, bytes]) => {
                    const byteVal = typeof bytes === 'number' ? bytes : 0;
                    const pct = totalLanguageBytes > 0 ? ((byteVal / totalLanguageBytes) * 100).toFixed(1) : 0;
                    return (
                      <div key={lang} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-800/50">
                        <span className="text-slate-300 font-medium">{lang}</span>
                        <span className="text-slate-400 font-mono">{pct}% ({byteVal.toLocaleString()} B)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No language distribution data available.</p>
            )}
          </Card>

          {/* Top Level Repository Files */}
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Folder className="w-4 h-4 text-cyan-400" />
              <span>Top-Level Structure ({files.length} items)</span>
            </h3>
            {files && files.length > 0 ? (
              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 transition-colors">
                    <div className="flex items-center gap-2 text-slate-200 truncate">
                      {file.type === 'dir' ? (
                        <Folder className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <FileCode className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className="font-mono truncate">{file.name || file.path}</span>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px] shrink-0 ml-2">
                      {file.type === 'dir' ? 'folder' : `${file.size || 0} B`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No files retrieved.</p>
            )}
          </Card>
        </div>

        {/* Contributors & Commits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Contributors */}
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Top Contributors ({contributors.length})</span>
            </h3>
            {contributors && contributors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {contributors.map((c, idx) => (
                  <a
                    key={idx}
                    href={c.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50"
                  >
                    <img src={c.avatarUrl} alt={c.username} className="w-8 h-8 rounded-full border border-slate-700 shrink-0" />
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate">{c.username}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.contributions.toLocaleString()} contributions</div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No contributors data available.</p>
            )}
          </Card>

          {/* Recent Commits */}
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <GitCommit className="w-4 h-4 text-cyan-400" />
              <span>Recent Commits (Latest {commits.length})</span>
            </h3>
            {commits && commits.length > 0 ? (
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {commits.map((commit, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-cyan-300 truncate">{commit.message?.split('\n')[0]}</span>
                      {commit.url && (
                        <a
                          href={commit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 shrink-0"
                        >
                          {commit.sha?.slice(0, 7)}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Author: <strong className="text-slate-400">{commit.author}</strong></span>
                      <span>{commit.date ? new Date(commit.date).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No recent commits data available.</p>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RepoDetailsPage;
