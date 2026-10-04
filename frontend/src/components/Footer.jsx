import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/60 py-6 text-center text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-4">
        <p>© {new Date().getFullYear()} AI GitHub Project Analyzer. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
