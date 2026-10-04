import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import { Star, GitFork, ShieldCheck, ArrowRight, Trash2 } from 'lucide-react';

const RepositoryCard = ({ repo, onDelete }) => {
  const repoId = repo._id || repo.id;
  const fullName = repo.fullName || (repo.owner && repo.name ? `${repo.owner}/${repo.name}` : repo.name || 'Repository');
  const targetLink = repo._id ? `/repository/${repo._id}` : (repo.url ? `/repository/details?url=${encodeURIComponent(repo.url)}` : `/repository/${repo.id}`);
  const summary = repo.aiAnalysis?.projectOverview?.summary || repo.description || 'No summary available.';
  const language = repo.language || (Array.isArray(repo.languages) && repo.languages[0]) || 'JavaScript';
  const stars = repo.stars ?? repo.stargazers_count ?? 0;
  const forks = repo.forks ?? repo.forks_count ?? 0;

  const formattedDate = repo.analyzedAt
    ? new Date(repo.analyzedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : (repo.lastUpdated || 'Recently');

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${fullName}" from your saved repositories?`)) {
      if (onDelete) onDelete(repoId);
    }
  };

  return (
    <Card hoverable className="flex flex-col justify-between h-full relative group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <Link
            to={targetLink}
            className="text-lg font-bold text-slate-100 hover:text-cyan-400 transition-colors line-clamp-1 pr-6"
          >
            {fullName}
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-3 h-3" />
              {repo.score || 95}/100
            </span>

            {onDelete && repoId && (
              <button
                onClick={handleDelete}
                title="Delete Repository"
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-400 line-clamp-2 mb-4">
          {summary}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400 border-t border-slate-800/80 pt-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            {language}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            {stars.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5 text-slate-400" />
            {forks.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-500">Analyzed {formattedDate}</span>
          <Link
            to={targetLink}
            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default RepositoryCard;
