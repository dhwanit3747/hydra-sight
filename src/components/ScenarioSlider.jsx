import React from 'react';
import { Slider } from './ui/slider';

export default function ScenarioSlider({ label, value, onChange, min, max, step = 1, unit, hint }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="text-[11px] font-semibold text-slate-600 tracking-[0.14em]">{label}</label>
        <div className="text-sm font-semibold text-slate-900 tabular-nums">
          {value}<span className="text-slate-500 font-normal text-xs ml-1">{unit}</span>
        </div>
      </div>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={(v) => onChange(v[0])} />
      <div className="flex justify-between text-[10px] text-slate-400 tabular-nums">
        <span>{min}{unit}</span>
        {hint && <span className="text-slate-500">{hint}</span>}
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
