import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Code2,
  ShieldCheck,
  Zap,
  BarChart3,
  Bot,
  FileCheck2,
  CheckCircle2,
  Layers
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI Repository Insights',
      description: 'Deep architectural understanding powered by Google Gemini AI models analyzing structural patterns.'
    },
    {
      icon: Code2,
      title: 'Code Quality Auditing',
      description: 'Automated maintainability metrics, cyclomatic complexity calculations, and duplication scans.'
    },
    {
      icon: ShieldCheck,
      title: 'Security Vulnerability Scan',
      description: 'Identify potential dependency vulnerabilities and security posture weaknesses before deployment.'
    },
    {
      icon: BarChart3,
      title: 'Visual Code Analytics',
      description: 'Interactive charts mapping language composition, commit velocities, and contributor breakdowns.'
    },
    {
      icon: Bot,
      title: 'Repository AI Chat Assistant',
      description: 'Conversational assistant tailored specifically to answer codebase queries in real time.'
    },
    {
      icon: FileCheck2,
      title: 'PDF Executive Reports',
      description: 'Generate polished, exportable PDF summary reports for team reviews and portfolio showcases.'
    }
  ];

  const steps = [
    { step: '01', title: 'Paste GitHub URL', desc: 'Input any public GitHub repository URL into the analysis portal.' },
    { step: '02', title: 'API & AI Extraction', desc: 'GitHub REST API fetches metadata while Gemini AI digests codebase structure.' },
    { step: '03', title: 'Explore & Chat', desc: 'View comprehensive metrics, architectural charts, and interact with the AI assistant.' }
  ];

  const techStack = [
    { name: 'React 19', tag: 'Frontend UI' },
    { name: 'Vite', tag: 'Build System' },
    { name: 'Tailwind CSS', tag: 'Styling' },
    { name: 'Node.js & Express', tag: 'Backend REST API' },
    { name: 'MongoDB & Mongoose', tag: 'Database' },
    { name: 'Google Gemini API', tag: 'AI Engine' },
    { name: 'GitHub REST API', tag: 'Repository Data' },
    { name: 'JWT & bcrypt', tag: 'Security' }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 border-b border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-slate-950 to-slate-950 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-lg shadow-cyan-950/50">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Next-Gen Developer Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
            AI GitHub Project Analyzer
          </h1>

          <p className="mt-6 text-lg sm:text-2xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Analyze, understand and improve GitHub repositories using AI.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/analyze">
              <Button variant="primary" size="lg" icon={Sparkles} className="w-full sm:w-auto">
                Analyze Repository
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" icon={ArrowRight} className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Quick Mock Preview Banner */}
          <div className="mt-16 max-w-5xl mx-auto p-3 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl">
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/80 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-500 font-mono ml-2">github.com/facebook/react</span>
                </div>
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-semibold">
                  Score: 96/100
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Architecture</span>
                  <p className="text-sm font-semibold text-slate-200 mt-1">Component-Driven Fiber Monorepo</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Code Quality</span>
                  <p className="text-sm font-semibold text-cyan-400 mt-1">94% Maintainability Rating</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">AI Insights</span>
                  <p className="text-sm font-semibold text-emerald-400 mt-1">0 Security Vulnerabilities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Powerful Features for Developers
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Everything you need to audit open-source projects, analyze legacy codebases, and write better code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} hoverable className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-slate-400 text-base">
              Get comprehensive repository insights in three quick steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((item, idx) => (
              <div key={idx} className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
                <span className="text-4xl font-black text-cyan-500/40 font-mono">{item.step}</span>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built with Modern Tech Stack
            </h2>
            <p className="text-slate-400 text-base">
              Powered by industry-standard full-stack tools and Google Gemini AI.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {techStack.map((tech, idx) => (
              <div key={idx} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 mb-1" />
                <span className="text-sm font-bold text-slate-100">{tech.name}</span>
                <span className="text-xs text-slate-500">{tech.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default LandingPage;
