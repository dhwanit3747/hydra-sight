import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { DemoBadge } from './DemoBadge';

export default function KPICard({ label, value, unit, change, trend = 'up', accent = 'sky', badge = 'LIVE' }) {
  const trendIcon = trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5"/> :
                    trend === 'down' ? <ArrowDownRight className="w-3.5 h-3.5"/> : <Minus className="w-3.5 h-3.5"/>;
  const trendColor = trend === 'up' ? 'text-red-600' : trend === 'down' ? 'text-emerald-600' : 'text-slate-500';
  const accents = {
    sky: 'from-sky-500 to-sky-600',
    blue: 'from-blue-600 to-blue-700',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    emerald: 'from-emerald-500 to-emerald-600',
  };
  return (
    <div className="relative bg-white rounded-lg border border-slate-200 p-5 hover:border-slate-300 transition-colors">
      <div className={`absolute top-0 left-0 w-full h-[3px] rounded-t-lg bg-gradient-to-r ${accents[accent] || accents.sky}`}/>
      <div className="flex items-start justify-between mb-3">
        <div className="text-[11px] font-semibold text-slate-500 tracking-[0.14em]">{label}</div>
        {badge && <DemoBadge label={badge} tone="green"/>}
      </div>
      <div className="flex items-baseline gap-1.5">
        <div className="text-3xl font-semibold text-slate-900 tracking-tight tabular-nums">{value}</div>
        {unit && <div className="text-sm text-slate-500 font-medium">{unit}</div>}
      </div>
      {change && (
        <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          {trendIcon} {change}
        </div>
      )}
    </div>
  );
}
