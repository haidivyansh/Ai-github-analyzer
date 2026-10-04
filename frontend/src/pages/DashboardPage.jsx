import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import StatisticsCard from '../components/StatisticsCard';
import RepositoryCard from '../components/RepositoryCard';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSavedRepositories, deleteSavedRepository } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Sparkles, FolderGit2, History, ArrowRight, Activity, AlertCircle, Trash2, CheckCircle2, User } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchRepositories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getSavedRepositories();
      if (res.success) {
        setRepositories(res.repositories || res.data || []);
      } else {
        setError(res.message || 'Failed to fetch saved repositories');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const handleDeleteRepository = async (id) => {
    try {
      const res = await deleteSavedRepository(id);
      if (res.success) {
        setRepositories((prev) => prev.filter((r) => r._id !== id && r.id !== id));
        setSuccessMessage('Repository deleted successfully');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        alert(res.message || 'Failed to delete repository');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Error deleting repository');
    }
  };

  // Compute live statistics based on saved repositories
  const totalAnalyzed = repositories.length;
  const totalStars = repositories.reduce((sum, r) => sum + (r.stars || r.stargazers_count || 0), 0);
  const languagesSet = new Set(repositories.map((r) => r.language).filter(Boolean));
  const totalLanguages = languagesSet.size;

  const stats = [
    { id: 1, title: 'Analyzed Repositories', value: totalAnalyzed.toString(), change: 'Live', isPositive: true },
    { id: 2, title: 'Total Stars Tracked', value: totalStars.toLocaleString(), change: 'Live', isPositive: true },
    { id: 3, title: 'Languages Detected', value: totalLanguages.toString(), change: 'Multi-lang', isPositive: true },
    { id: 4, title: 'AI Reports Generated', value: totalAnalyzed.toString(), change: 'JWT Secure', isPositive: true }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* User Welcome & Quick CTA Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/20"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-cyan-500/20 uppercase">
                {user?.name ? user.name.charAt(0) : <User className="w-7 h-7" />}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">Welcome back, {user?.name || 'Developer'}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  JWT Authenticated
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{user?.email || 'Logged in user'}</p>
            </div>
          </div>

          <Link to="/analyze">
            <Button variant="primary" size="md" icon={Search}>
              Analyze New Repository
            </Button>
          </Link>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="flex items-center justify-between p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-300 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage('')} className="text-xs hover:text-white">Dismiss</button>
          </div>
        )}

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <StatisticsCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              isPositive={stat.isPositive}
              icon={FolderGit2}
            />
          ))}
        </div>

        {/* Recent Repositories Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-slate-100">My Analyzed Repositories ({repositories.length})</h2>
            </div>
            <Link to="/analyze" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Analyze Another <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="lg" text="Loading your saved repositories from MongoDB..." />
            </div>
          ) : error ? (
            <Card className="p-8 border-rose-500/30 bg-rose-950/20 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Database Error</h3>
              <p className="text-sm text-rose-300">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchRepositories}>
                Retry Fetching Repositories
              </Button>
            </Card>
          ) : repositories.length === 0 ? (
            <Card className="p-12 text-center space-y-4 border-dashed border-slate-800">
              <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-200">No repositories analyzed yet</h3>
                <p className="text-sm text-slate-400">
                  Analyze your first GitHub repository to see it here.
                </p>
              </div>
              <Link to="/analyze" className="inline-block">
                <Button variant="primary" size="md" icon={Search}>
                  Analyze Your First Repository
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {repositories.map((repo) => (
                <RepositoryCard key={repo._id || repo.id} repo={repo} onDelete={handleDeleteRepository} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Analysis Activity Stream */}
        {repositories.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-slate-100">Recent MongoDB Analysis Activity</h2>
            </div>

            <Card className="divide-y divide-slate-800/80 p-0 overflow-hidden">
              {repositories.map((repo) => {
                const repoId = repo._id || repo.id;
                const formattedDate = repo.analyzedAt
                  ? new Date(repo.analyzedAt).toLocaleDateString()
                  : 'Recently';

                return (
                  <div key={repoId} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <Link to={`/repository/${repoId}`} className="text-sm font-bold text-slate-200 hover:text-cyan-400 transition-colors">
                          {repo.fullName || repo.name}
                        </Link>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span>Analyzed {formattedDate}</span>
                          <span>•</span>
                          <span className="text-cyan-400 font-semibold">{repo.language || 'GitHub'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/repository/${repoId}/analysis`}>
                        <Button variant="outline" size="sm" icon={Sparkles}>
                          View AI Report
                        </Button>
                      </Link>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${repo.fullName || repo.name}?`)) {
                            handleDeleteRepository(repoId);
                          }
                        }}
                        title="Delete"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
