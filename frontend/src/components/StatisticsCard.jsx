import React from 'react';
import Card from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatisticsCard = ({ title, value, change, isPositive = true, icon: Icon }) => {
  return (
    <Card hoverable className="flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-extrabold text-white tracking-tight">{value}</div>
        {change && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{change}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatisticsCard;
