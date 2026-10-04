import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ChartContainer from '../components/ChartContainer';
import Card from '../components/Card';
import { mockAnalytics, mockRepositories } from '../services/mockData';
import { BarChart3, PieChartIcon, Activity, Users } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

const AnalyticsPage = () => {
  const { id } = useParams();
  const repo = mockRepositories.find((r) => r.id === id) || mockRepositories[0];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" />
              Repository Visual Metrics
            </div>
            <h1 className="text-2xl font-extrabold text-white">Analytics: {repo.fullName}</h1>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Programming Languages Distribution */}
          <ChartContainer title="Programming Languages Breakdown" subtitle="Percentage breakdown of source files">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockAnalytics.languages}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockAnalytics.languages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs mt-2">
              {mockAnalytics.languages.map((lang, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                  <span className="text-slate-300 font-medium">{lang.name} ({lang.value}%)</span>
                </div>
              ))}
            </div>
          </ChartContainer>

          {/* 2. Commit Activity Timeline */}
          <ChartContainer title="Commit Activity Velocity" subtitle="Monthly commit volume over past 6 months">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAnalytics.commitActivity}>
                <defs>
                  <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="commits" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#commitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* 3. Code Quality Breakdown Bar Chart */}
          <ChartContainer title="Code Health Category Breakdown" subtitle="Detailed audit scores per domain">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalytics.codeQualityBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* 4. Top Contributors Table / Cards */}
          <Card className="space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">Top Repository Contributors</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">Core maintainers by lifetime commit volume</p>

              <div className="space-y-3">
                {mockAnalytics.contributors.map((contrib, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <img src={contrib.avatar} alt={contrib.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-sm font-bold text-slate-200">{contrib.name}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-500/30">
                      {contrib.commits} commits
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
