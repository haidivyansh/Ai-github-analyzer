import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useHealth } from '../hooks/useHealth';

const Home = () => {
  const { health, loading, error } = useHealth();

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            AI-Powered Analysis Engine
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            AI GitHub Project Analyzer
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal">
            Analyze and understand GitHub repositories using AI.
          </p>

          {/* Backend Status Indicator */}
          <div className="pt-8 flex flex-col items-center justify-center">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 max-w-md w-full text-left backdrop-blur font-mono text-sm">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700/50">
                <span className="text-xs font-sans text-slate-400 font-semibold uppercase">Backend API Status</span>
                {loading ? (
                  <span className="text-xs text-amber-400 animate-pulse">Connecting...</span>
                ) : error ? (
                  <span className="text-xs text-rose-400 font-semibold">Offline</span>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold">Online</span>
                )}
              </div>
              
              {loading && <p className="text-slate-400 text-xs">Ping /api/health...</p>}
              
              {error && (
                <div className="text-rose-400 text-xs">
                  Error: {error}
                </div>
              )}
              
              {health && (
                <div className="space-y-1 text-xs">
                  <div className="text-emerald-400">✓ Status: {health.success ? 'Success' : 'Failed'}</div>
                  <div className="text-slate-300">Message: "{health.message}"</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
