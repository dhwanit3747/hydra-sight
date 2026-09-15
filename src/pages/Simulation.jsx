import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import ScenarioSlider from '../components/ScenarioSlider';
import MapView from '../components/MapView';
import { DemoBadge, RiskBadge } from '../components/DemoBadge';
import { api } from '../services/api';
import { Play, RotateCcw, GitCompare, Zap, CloudRain, MapPin } from 'lucide-react';
import { getIMDRainfallCategory, IMD_RAINFALL_THRESHOLDS } from '../utils/imdStandard';

const BASELINE = { probability: 0.42, area: 128, risk: 'MODERATE' };
const SCENARIO_PRESETS = [
  { id: 'low', label: 'LOW', rainfall: 15, duration: 24, soil: 35, drainage: 75, description: 'Light rain: 2.5–15.5 mm / 24h' },
  { id: 'moderate', label: 'MODERATE', rainfall: 50, duration: 12, soil: 65, drainage: 50, description: 'Moderate rain: 15.6–64.4 mm / 24h' },
  { id: 'high', label: 'HIGH', rainfall: 100, duration: 6, soil: 80, drainage: 30, description: 'Heavy rain: 64.5–115.5 mm / 24h' },
];
const SIMULATION_AREAS = [
  { id: 'all', label: 'All India flood basins' },
  { id: 'i1', label: 'West Bengal — Hooghly Basin' },
  { id: 'i2', label: 'Odisha — Mahanadi Delta' },
  { id: 'i3', label: 'Assam — Brahmaputra Valley' },
  { id: 'i4', label: 'Bihar — Ganga-Kosi Floodplain' },
  { id: 'i5', label: 'Kerala — Periyar / Vembanad' },
];

export default function Simulation() {
  const [rainfall, setRainfall] = useState(50);
  const [duration, setDuration] = useState(12);
  const [soil, setSoil] = useState(65);
  const [drainage, setDrainage] = useState(50);
  const [activeScenario, setActiveScenario] = useState('moderate');
  const [selectedArea, setSelectedArea] = useState('all');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const imdCat = getIMDRainfallCategory(rainfall);

  const filterResult = (res, areaId) => {
    const zones = areaId === 'all' ? res.zones : res.zones.filter((zone) => zone.id === areaId);
    return {
      ...res,
      zones,
      areaKm2: +zones.reduce((total, zone) => total + Number(zone.area || 0), 0).toFixed(1),
    };
  };

  const visibleArea = result?.zones?.reduce((total, zone) => total + Number(zone.area || 0), 0) || 0;
  const visibleProbability = result?.zones?.length
    ? Math.max(...result.zones.map((zone) => Number(zone.prob || 0)))
    : result?.probability || 0;
  const visibleRisk = result?.zones?.length
    ? result.zones.reduce((highest, zone) => {
      const rank = { LOW: 1, MODERATE: 2, HIGH: 3, CRITICAL: 4 };
      return rank[zone.level] > rank[highest] ? zone.level : highest;
    }, 'LOW')
    : result?.risk;

  const run = async (areaId = selectedArea) => {
    setRunning(true);
    const res = await api.runScenario({ rainfall, duration, soil, drainage, area: areaId });
    setResult(filterResult(res, areaId)); setRunning(false);
  };

  const selectArea = async (areaId) => {
    setSelectedArea(areaId);
    await run(areaId);
  };

  const applyPreset = async (preset) => {
    setActiveScenario(preset.id);
    setRainfall(preset.rainfall);
    setDuration(preset.duration);
    setSoil(preset.soil);
    setDrainage(preset.drainage);
    setRunning(true);
    const res = await api.runScenario({ ...preset, area: selectedArea });
    setResult(filterResult(res, selectedArea));
    setRunning(false);
  };

  const reset = () => {
    const preset = SCENARIO_PRESETS[1];
    setActiveScenario(preset.id);
    setSelectedArea('all');
    setRainfall(preset.rainfall); setDuration(preset.duration); setSoil(preset.soil); setDrainage(preset.drainage); setResult(null);
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
              <div className="grid grid-cols-3 gap-2 mb-5" role="group" aria-label="IMD rainfall scenarios">
                {SCENARIO_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    disabled={running}
                    className={`rounded-md border px-2 py-2 text-left transition-colors disabled:cursor-wait disabled:opacity-60 ${
                      activeScenario === preset.id
                        ? 'border-sky-400 bg-sky-50 text-sky-800 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-300 hover:bg-sky-50/50'
                    }`}
                  >
                    <span className="block text-[10px] font-bold tracking-wider">{preset.label}</span>
                    <span className="block mt-1 text-[10px] leading-tight">{preset.description}</span>
                  </button>
                ))}
              </div>
            <h1 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-tight">What if the rain increases?</h1>
            <p className="text-sm text-slate-500 mt-1">Move the sliders and see how flood extent, probability and risk shift based on IMD standards.</p>
          </div>
          <DemoBadge label="IMD STANDARDS ALIGNED" tone="blue"/>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-600"/>
                  <h3 className="text-sm font-semibold text-slate-900">Scenario Controls</h3>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${imdCat.colorClass}`}>
                  IMD: {imdCat.category}
                </span>
              </div>
              <div className="mb-5">
                <label htmlFor="simulation-area" className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 tracking-[0.14em]">
                  <MapPin className="w-3.5 h-3.5 text-sky-600"/> SIMULATION AREA
                </label>
                <select
                  id="simulation-area"
                  value={selectedArea}
                  onChange={(event) => selectArea(event.target.value)}
                  disabled={running}
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-wait disabled:opacity-60"
                >
                  {SIMULATION_AREAS.map((area) => <option key={area.id} value={area.id}>{area.label}</option>)}
                </select>
              </div>
              <div className="space-y-5">
                <ScenarioSlider
                  label="RAINFALL"
                  value={rainfall}
                  onChange={setRainfall}
                  min={0}
                  max={300}
                  unit="mm"
                  hint={imdCat.hint}
                />
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

            {/* IMD Standard Reference Panel */}
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-sky-600"/>
                  <h3 className="text-sm font-semibold text-slate-900">IMD Standard Rainfall Classification</h3>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">24-HOUR ACCUMULATION</span>
              </div>
              <div className="space-y-2">
                {IMD_RAINFALL_THRESHOLDS.map((thresh) => {
                  const isActive = imdCat.code === thresh.code;
                  return (
                    <div
                      key={thresh.code}
                      className={`flex items-center justify-between p-2 rounded text-xs transition-colors border ${
                        isActive
                          ? 'bg-sky-50/80 border-sky-300 font-semibold shadow-sm'
                          : 'bg-slate-50/50 border-slate-100 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: thresh.dotColor }}/>
                        <span>{thresh.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-slate-500">{thresh.range}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          thresh.risk === 'LOW' ? 'bg-emerald-100 text-emerald-800' :
                          thresh.risk === 'MODERATE' ? 'bg-amber-100 text-amber-800' :
                          thresh.risk === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {thresh.risk}
                        </span>
                      </div>
                    </div>
                  );
                })}
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
              {compareRow('Rain Category', 'Moderate Rain', imdCat.category)}
              {compareRow('Flood Prob', `${Math.round(BASELINE.probability*100)}%`, result ? `${Math.round(result.probability*100)}%` : '—')}
              {compareRow('Area', BASELINE.area, result ? `${visibleArea.toFixed(1)}` : '—', ' km²')}
              <div className="grid grid-cols-3 gap-3 py-3">
                <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Risk</div>
                <div><RiskBadge level={BASELINE.risk}/></div>
                <div>{result ? <RiskBadge level={result.risk}/> : <RiskBadge level={imdCat.risk}/>}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Simulated Flood Extent</h3>
                  <p className="text-xs text-slate-500">Map updates when scenario runs • Grounded on IMD standards</p>
                </div>
                {result && (
                  <div className="text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded px-2 py-1">
                    SIMULATED • {Math.round(result.probability*100)}% • {result.areaKm2} km² • {result.imd?.category || imdCat.category}
                  </div>
                )}
              </div>
              {result && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  {[
                    { label: 'SIMULATION RISK', value: visibleRisk },
                    { label: 'FLOOD PROBABILITY', value: `${Math.round(visibleProbability * 100)}%` },
                    { label: 'AREA COVERED', value: `${visibleArea.toFixed(1)} km²` },
                    { label: 'VISIBLE ZONES', value: result.zones.length },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-md border border-sky-100 bg-sky-50/60 px-3 py-2">
                      <div className="text-[9px] font-semibold tracking-wider text-sky-700">{metric.label}</div>
                      <div className="mt-1 text-sm font-semibold text-slate-900 tabular-nums">{metric.value}</div>
                    </div>
                  ))}
                </div>
              )}
              <MapView height={620} simulation={result} showStations={false}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
