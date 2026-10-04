import React from 'react';
import Card from './Card';

const ChartContainer = ({ title, subtitle, children }) => {
  return (
    <Card className="w-full">
      <div className="mb-6">
        <h3 className="text-base font-bold text-slate-100">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className="w-full h-64 sm:h-72">
        {children}
      </div>
    </Card>
  );
};

export default ChartContainer;
