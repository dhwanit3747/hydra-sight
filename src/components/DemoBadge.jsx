import React from 'react';

export function DemoBadge({ label = 'OPERATIONAL', tone = 'green', className = '' }) {
  const tones = {
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-sky-50 text-sky-700 border-sky-200',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wider ${tones[tone] || tones.green} ${className}`}>
      {label}
    </span>
  );
}

export function RiskBadge({ level }) {
  const map = {
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MODERATE: 'bg-amber-50 text-amber-800 border-amber-200',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
    CRITICAL: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-[11px] font-semibold tracking-wider ${map[level] || map.LOW}`}>
      {level}
    </span>
  );
}
