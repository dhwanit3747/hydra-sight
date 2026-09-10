import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import ScenarioSlider from '../components/ScenarioSlider';
import MapView from '../components/MapView';
import { DemoBadge, RiskBadge } from '../components/DemoBadge';
import { api } from '../services/api';
import { Play, RotateCcw, GitCompare, Zap } from 'lucide-react';

const BASELINE = { probability: 0.42, area: 128, risk: 'MODERATE' };

export default function Simulation() {
  const [rainfall, setRainfall] = useState(150);
  const [duration, setDuration] = useState(12);
  const [soil, setSoil] = useState(65);
  const [drainage, setDrainage] = useState(50);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    setRunning(true);
    const res = await api.runScenario({ rainfall, duration, soil, drainage });
    setResult(res); setRunning(false);
  };

  const reset = () => {
    setRainfall(150); setDuration(12); setSoil(65); setDrainage(50); setResult(null);
  };

  const compareRow = (label, current, simulated, unit = '') => (
    <div className="grid grid-cols-3 gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase">{label}</div>
      <div className="text-sm text-slate-700 tabular-nums">{current}{unit}</div>
      <div className="text-sm text-sky-700 font-semibold tabular-nums">{simulated}{unit}</div>
    </div>
  );

  return (
    <div className="pt-16 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="text-[11px] font-semibold text-sky-700 tracking-[0.18em] mb-2">FLOOD SCENARIO SIMULATOR</div>
            <h1 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-tight">What if the rain increases?</h1>
            <p className="text-sm text-slate-500 mt-1">Move the sliders and see how flood extent, probability and risk shift.</p>
          </div>
          <DemoBadge label="SIMULATION" tone="blue"/>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-sky-600"/>
                <h3 className="text-sm font-semibold text-slate-900">Scenario Controls</h3>
              </div>
              <div className="space-y-5">
                <ScenarioSlider label="RAINFALL" value={rainfall} onChange={setRainfall} min={0} max={300} unit="mm" hint={rainfall > 200 ? 'extreme' : rainfall > 100 ? 'heavy' : 'moderate'}/>
                <ScenarioSlider label="DURATION" value={duration} onChange={setDuration} min={1} max={24} unit="h"/>
                <ScenarioSlider label="SOIL SATURATION" value={soil} onChange={setSoil} min={0} max={100} unit="%"/>
                <ScenarioSlider label="DRAINAGE CAPACITY" value={drainage} onChange={setDrainage} min={0} max={100} unit="%"/>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={run} disabled={running} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white h-11">
                  <Play className="w-4 h-4 mr-2"/> {running ? 'Simulating…' : 'RUN SCENARIO'}
                </Button>
                <Button onClick={reset} variant="outline" className="h-11">
                  <RotateCcw className="w-4 h-4"/>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <GitCompare className="w-4 h-4 text-slate-600"/>
                <h3 className="text-sm font-semibold text-slate-900">Current vs Simulated</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 pb-2 border-b border-slate-200 mb-1">
                <div className="text-[10px] font-semibold text-slate-400 tracking-wider">METRIC</div>
                <div className="text-[10px] font-semibold text-slate-400 tracking-wider">CURRENT</div>
                <div className="text-[10px] font-semibold text-sky-600 tracking-wider">SIMULATED</div>
              </div>
              {compareRow('Flood Prob', `${Math.round(BASELINE.probability*100)}%`, result ? `${Math.round(result.probability*100)}%` : '—')}
              {compareRow('Area', BASELINE.area, result ? result.areaKm2 : '—', ' km²')}
              <div className="grid grid-cols-3 gap-3 py-3">
                <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Risk</div>
                <div><RiskBadge level={BASELINE.risk}/></div>
                <div>{result ? <RiskBadge level={result.risk}/> : <span className="text-slate-400 text-xs">—</span>}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Simulated Flood Extent</h3>
                  <p className="text-xs text-slate-500">Map updates when scenario runs</p>
                </div>
                {result && (
                  <div className="text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded px-2 py-1">
                    SIMULATED • {Math.round(result.probability*100)}% • {result.areaKm2} km²
                  </div>
                )}
              </div>
              <MapView height={620} simulation={result} showStations={false}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
