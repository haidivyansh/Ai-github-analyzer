export const mockUser = {
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  role: 'Senior Full Stack Developer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  plan: 'Pro Developer'
};

export const mockStats = [
  { id: 1, title: 'Analyzed Repositories', value: '14', change: '+3 this week', isPositive: true },
  { id: 2, title: 'AI Insights Generated', value: '86', change: '+12 today', isPositive: true },
  { id: 3, title: 'Avg Repository Quality', value: '94%', change: '+2.4%', isPositive: true },
  { id: 4, title: 'Security Vulnerabilities', value: '0 Critical', change: '-4 resolved', isPositive: true },
];

export const mockRepositories = [
  {
    id: 'react-core',
    name: 'react',
    owner: 'facebook',
    fullName: 'facebook/react',
    description: 'The library for web and native user interfaces.',
    stars: 228450,
    forks: 46210,
    openIssues: 780,
    language: 'JavaScript',
    license: 'MIT',
    score: 96,
    lastUpdated: '2 hours ago',
    url: 'https://github.com/facebook/react',
    topics: ['javascript', 'react', 'ui', 'frontend', 'declarative'],
    defaultBranch: 'main'
  },
  {
    id: 'nextjs-app',
    name: 'next.js',
    owner: 'vercel',
    fullName: 'vercel/next.js',
    description: 'The React Framework for the Web. Built on top of React with full-stack rendering support.',
    stars: 125300,
    forks: 27150,
    openIssues: 1420,
    language: 'TypeScript',
    license: 'MIT',
    score: 94,
    lastUpdated: '5 hours ago',
    url: 'https://github.com/vercel/next.js',
    topics: ['react', 'nextjs', 'ssr', 'typescript', 'framework'],
    defaultBranch: 'canary'
  },
  {
    id: 'express-backend',
    name: 'express',
    owner: 'expressjs',
    fullName: 'expressjs/express',
    description: 'Fast, unopinionated, minimalist web framework for node.',
    stars: 64900,
    forks: 14300,
    openIssues: 110,
    language: 'JavaScript',
    license: 'MIT',
    score: 89,
    lastUpdated: '1 day ago',
    url: 'https://github.com/expressjs/express',
    topics: ['express', 'node', 'backend', 'web', 'framework'],
    defaultBranch: 'master'
  },
  {
    id: 'tailwind-css',
    name: 'tailwindcss',
    owner: 'tailwindlabs',
    fullName: 'tailwindlabs/tailwindcss',
    description: 'A utility-first CSS framework for rapid UI development.',
    stars: 81900,
    forks: 4200,
    openIssues: 45,
    language: 'TypeScript',
    license: 'MIT',
    score: 95,
    lastUpdated: '3 days ago',
    url: 'https://github.com/tailwindlabs/tailwindcss',
    topics: ['css', 'tailwind', 'utility-first', 'design-system'],
    defaultBranch: 'main'
  }
];

export const mockAIAnalysis = {
  overview: "This repository represents a highly mature, enterprise-grade JavaScript/TypeScript codebase with modular architecture, strict API contracts, and high test coverage.",
  techStack: [
    { name: 'React', category: 'Frontend UI', confidence: '100%' },
    { name: 'TypeScript / ESNext', category: 'Language', confidence: '98%' },
    { name: 'Jest & React Testing Library', category: 'Testing', confidence: '95%' },
    { name: 'Webpack / Rollup', category: 'Bundler', confidence: '92%' },
    { name: 'ESLint & Prettier', category: 'Code Quality', confidence: '100%' }
  ],
  architecture: {
    pattern: "Component-Driven & Modular Monorepo Architecture",
    description: "Employs clear domain isolation with a core reconciliation engine decoupled from platform-specific renderer implementations (DOM, Native, Server).",
    components: [
      { name: 'Reconciler', role: 'Fiber reconciliation & diffing algorithm' },
      { name: 'DOM Renderer', role: 'Browser DOM bindings and synthetic event system' },
      { name: 'Scheduler', role: 'Cooperative task scheduling and priority queues' }
    ]
  },
  codeQuality: {
    score: 94,
    maintainability: 'Excellent',
    cyclomaticComplexity: 'Low to Medium',
    duplicationRate: '1.2%',
    highlights: [
      'Strict adherence to functional programming patterns and immutable state updates',
      'Extensive docstrings and clear type contracts across public APIs',
      'Consistent error boundaries and graceful exception handling'
    ]
  },
  documentation: {
    status: 'Comprehensive',
    score: 96,
    readmeQuality: 'Excellent - includes installation, quickstart, architecture guides, and contributing docs.'
  },
  testing: {
    coverage: '92%',
    frameworks: ['Jest', 'DOM Testing Library'],
    status: 'Robust suite covering unit, integration, and regression tests.'
  },
  security: {
    status: 'Passed',
    vulnerabilitiesFound: 0,
    recommendations: [
      'Maintain automated Dependabot dependency updates for npm packages',
      'Ensure Content Security Policy (CSP) headers are documented for production usage'
    ]
  },
  improvementSuggestions: [
    { title: 'Reduce bundle overhead in legacy renderers', priority: 'Medium', area: 'Performance' },
    { title: 'Add explicit benchmark metrics in CI pipeline', priority: 'Low', area: 'DevOps' },
    { title: 'Expand end-to-end browser integration tests', priority: 'Medium', area: 'Testing' }
  ]
};

export const mockAnalytics = {
  languages: [
    { name: 'JavaScript', value: 55, color: '#f7df1e' },
    { name: 'TypeScript', value: 32, color: '#3178c6' },
    { name: 'HTML/CSS', value: 8, color: '#e34c26' },
    { name: 'Shell / C++', value: 5, color: '#89e051' }
  ],
  commitActivity: [
    { month: 'Jan', commits: 140 },
    { month: 'Feb', commits: 210 },
    { month: 'Mar', commits: 185 },
    { month: 'Apr', commits: 290 },
    { month: 'May', commits: 240 },
    { month: 'Jun', commits: 320 }
  ],
  codeQualityBreakdown: [
    { category: 'Architecture', score: 96 },
    { category: 'Documentation', score: 92 },
    { category: 'Code Quality', score: 94 },
    { category: 'Security', score: 98 },
    { category: 'Testing', score: 90 }
  ],
  contributors: [
    { name: 'Dan Abramov', commits: 1240, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
    { name: 'Sophie Alpert', commits: 980, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { name: 'Sebastian Markbåge', commits: 870, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' },
    { name: 'Andrew Clark', commits: 760, avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100' }
  ]
};

export const mockChatMessages = [
  {
    id: 1,
    sender: 'ai',
    text: 'Hello! I have completed analyzing **facebook/react**. Ask me anything about its architecture, codebase, dependencies, or security practices.',
    timestamp: '10:30 AM'
  },
  {
    id: 2,
    sender: 'user',
    text: 'What does this project do?',
    timestamp: '10:31 AM'
  },
  {
    id: 3,
    sender: 'ai',
    text: 'React is an open-source JavaScript library for building user interfaces, primarily for single-page applications. It allows developers to create reusable UI components, manage component state efficiently, and render updates using a virtual DOM diffing algorithm (Fiber reconciler).',
    timestamp: '10:31 AM'
  }
];
