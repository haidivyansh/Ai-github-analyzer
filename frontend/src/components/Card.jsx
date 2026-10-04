import React from 'react';

const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl transition-all duration-200 ${
        hoverable ? 'hover:border-slate-700 hover:shadow-cyan-950/20 hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
