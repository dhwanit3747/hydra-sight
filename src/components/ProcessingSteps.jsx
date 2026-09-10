import React from 'react';
import { Loader2, Check } from 'lucide-react';

export default function ProcessingSteps({ active, steps, done = false }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
      <ol className="space-y-2">
        {steps.map((s, i) => {
          const isDone = done || i < active;
          const isActive = !done && i === active;
          return (
            <li key={i} className="flex items-center gap-3 text-sm">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {isDone ? <Check className="w-3.5 h-3.5"/> : isActive ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : i + 1}
              </div>
              <span className={isDone ? 'text-slate-400 line-through' : isActive ? 'text-slate-900 font-medium' : 'text-slate-600'}>{s}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
