import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  FileText,
  BrainCircuit,
  BarChart3,
  MessageSquareCode,
  Download,
  ChevronLeft
} from 'lucide-react';
import GithubIcon from './GithubIcon';

const Sidebar = () => {
  const { id } = useParams();

  const mainLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analyze', label: 'Analyze Repository', icon: Search },
  ];

  const repoLinks = id ? [
    { to: `/repository/${id}`, label: 'Repo Details', icon: FileText },
    { to: `/repository/${id}/analysis`, label: 'AI Analysis', icon: BrainCircuit },
    { to: `/repository/${id}/analytics`, label: 'Analytics', icon: BarChart3 },
    { to: `/repository/${id}/chat`, label: 'AI Chat', icon: MessageSquareCode },
    { to: `/repository/${id}/report`, label: 'Export Report', icon: Download },
  ] : [];

  return (
    <aside className="w-64 bg-slate-950/90 border-r border-slate-800/80 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-6">
        {/* Main Section */}
        <div>
          <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Main Workspace
          </h4>
          <nav className="space-y-1">
            {mainLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Repository Specific Sub-menu */}
        {id && (
          <div className="pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between px-3 mb-2">
              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Repository View
              </h4>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded font-mono truncate max-w-[100px]">
                {id}
              </span>
            </div>
            <nav className="space-y-1">
              {repoLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === `/repository/${id}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Sidebar Footer Info */}
      <div className="mt-auto pt-6 border-t border-slate-800/80">
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <GithubIcon className="w-4 h-4 text-cyan-400" />
            <span>AI Model Engine</span>
          </div>
          <p className="text-[11px] text-slate-500">Gemini 1.5 Flash Connected</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
