import React from 'react';
import { Circle } from 'lucide-react';

const statusMap = {
  CONNECTED: { color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  READY: { color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  DELAYED: { color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  PARTIAL: { color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  OFFLINE: { color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
  DEMO: { color: 'bg-sky-500', text: 'text-sky-700', bg: 'bg-sky-50' },
};

export default function DataStatus({ sources = [] }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Data Source Health</h3>
        <span className="text-[10px] font-semibold text-slate-400 tracking-[0.14em]">LIVE</span>
      </div>
      <ul className="divide-y divide-slate-100">
        {sources.map((s) => {
          const st = statusMap[s.status] || statusMap.DEMO;
          return (
            <li key={s.id} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2.5">
                <Circle className={`w-2 h-2 rounded-full fill-current ${st.color} text-transparent animate-pulse`}/>
                <span className="text-sm text-slate-700">{s.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 tabular-nums">{s.latency}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${st.bg} ${st.text}`}>{s.status}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
