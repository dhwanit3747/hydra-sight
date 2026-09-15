import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import ScenarioSlider from '../components/ScenarioSlider';
import ProcessingSteps from '../components/ProcessingSteps';
import MapView from '../components/MapView';
import { DemoBadge, RiskBadge } from '../components/DemoBadge';
import { api } from '../services/api';
import { Play, Droplets, Mountain, Layers } from 'lucide-react';
import { getIMDRainfallCategory } from '../utils/imdStandard';

const STEPS = ['Loading terrain grid', 'Computing runoff', 'Simulating inundation', 'Overlaying infrastructure', 'Ready'];

export default function Inundation() {
  const [rainfall, setRainfall] = useState(150);
  const [duration, setDuration] = useState(12);
  const [slope, setSlope] = useState(6);
  const [soil, setSoil] = useState(65);
  const [drainage, setDrainage] = useState(45);
  const [landCover, setLandCover] = useState(30);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);

  const imdCat = getIMDRainfallCategory(rainfall);

  const run = async () => {
    setRunning(true); setResult(null); setStep(0);
    for (let i = 0; i < STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 420)); setStep(i + 1);
    }
    const res = await api.runInundationPrediction({ rainfall, duration, slope, soil, drainage });
    setResult(res); setRunning(false);
  };

  return (
    <div className="pt-16 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="text-[11px] font-semibold text-sky-700 tracking-[0.18em] mb-2">INUNDATION MODELING</div>
            <h1 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-tight">Flood Extent Prediction</h1>
            <p className="text-sm text-slate-500 mt-1">Terrain + hydrology + drainage — modeled in real time using IMD standards.</p>
          </div>
          <DemoBadge label="OPERATIONAL MODEL" tone="green"/>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600"/>
                  <h3 className="text-sm font-semibold text-slate-900">Input Parameters</h3>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${imdCat.colorClass}`}>
                  IMD: {imdCat.category}
                </span>
              </div>
              <div className="space-y-5">
                <ScenarioSlider label="RAINFALL" value={rainfall} onChange={setRainfall} min={0} max={300} unit="mm" hint={imdCat.hint}/>
                <ScenarioSlider label="DURATION" value={duration} onChange={setDuration} min={1} max={24} unit="h"/>
                <ScenarioSlider label="TERRAIN SLOPE" value={slope} onChange={setSlope} min={0} max={30} unit="°"/>
                <ScenarioSlider label="SOIL SATURATION" value={soil} onChange={setSoil} min={0} max={100} unit="%"/>
                <ScenarioSlider label="DRAINAGE CAPACITY" value={drainage} onChange={setDrainage} min={0} max={100} unit="%"/>
                <ScenarioSlider label="LAND COVER (impervious)" value={landCover} onChange={setLandCover} min={0} max={100} unit="%"/>
              </div>
              <Button onClick={run} disabled={running} className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11 mt-6">
                <Play className="w-4 h-4 mr-2"/> {running ? 'Running…' : 'RUN INUNDATION PREDICTION'}
              </Button>
            </div>
            {(running || result) && (
              <ProcessingSteps steps={STEPS} active={step} done={!running && result}/>
            )}
            {result && (
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <div className="text-[11px] font-semibold text-slate-500 tracking-[0.14em] mb-3">RESULT</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-slate-500">Flood Probability</div>
                    <div className="text-2xl font-semibold text-slate-900 tabular-nums">{Math.round(result.probability * 100)}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Predicted Area</div>
                    <div className="text-2xl font-semibold text-slate-900 tabular-nums">{result.areaKm2} <span className="text-xs text-slate-500">km²</span></div>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-500 to-blue-700" style={{ width: `${result.probability * 100}%` }}/>
                </div>
                <div className="mt-3 text-[10px] text-emerald-700 font-semibold tracking-wider">ML HYDROLOGICAL INUNDATION PREDICTION</div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">Predicted Inundation Map</h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Droplets className="w-3.5 h-3.5 text-sky-500"/> flood zones
                  <Mountain className="w-3.5 h-3.5 text-slate-500 ml-3"/> terrain
                </div>
              </div>
              <MapView height={620} showInfrastructure showStations={false} showStates={false} simulation={result}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
