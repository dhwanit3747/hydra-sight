import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid, ReferenceLine, Legend } from 'recharts';
import { api } from '../services/api';
import { Button } from '../components/ui/button';
import { DemoBadge } from '../components/DemoBadge';
import ProcessingSteps from '../components/ProcessingSteps';
import { CloudRain, Radar, Satellite, Cpu, Play, TrendingUp, RefreshCw } from 'lucide-react';

const STEPS = ['Collecting weather data', 'Merging radar + satellite', 'Running NWP ensemble', 'AI rainfall prediction', 'Generating forecast'];

export default function Rainfall() {
  const [timeline, setTimeline] = useState([]);
  const [stations, setStations] = useState([]);
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const [tl, st, k] = await Promise.all([
      api.getRainfallTimeline(),
      api.getStations(),
      api.getKPI(),
    ]);
    setTimeline(tl);
    setStations(st);
    setKpi(k);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const run = async () => {
    setRunning(true); setResult(null); setStep(0);
    for (let i = 0; i < STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 450));
      setStep(i + 1);
    }
    const avgR = stations.length ? stations.reduce((a, s) => a + s.rain24, 0) / stations.length : 87.4;
    const maxR = stations.length ? Math.max(...stations.map(s => s.rain24)) : 145;
    const avgHumidity = stations.length && stations[0].humidity ? stations.reduce((a, s) => a + (s.humidity || 75), 0) / stations.length : 75;
    const avgTemp = stations.length ? stations.reduce((a, s) => a + (s.temp || 28), 0) / stations.length : 28;
    const res = await api.runRainfallPrediction({
      rainfall_mm: parseFloat(avgR.toFixed(1)),
      max_station_rainfall: parseFloat(maxR.toFixed(1)),
      humidity: parseFloat(avgHumidity.toFixed(1)),
      temperature_c: parseFloat(avgTemp.toFixed(1)),
      pressure_hpa: stations[0]?.pressure || 1005,
      month: new Date().getMonth() + 1,
      station_count: stations.length,
    });
    setResult(res); setRunning(false);
  };

  const avgRain = stations.length ? (stations.reduce((a, s) => a + s.rain24, 0) / stations.length).toFixed(1) : (kpi?.currentRainfall?.value ?? 87.4);
  const maxRain = stations.length ? Math.max(...stations.map(s => s.rain24)).toFixed(0) : (kpi?.forecastRainfall?.value ?? 214);
  const highRainProb = kpi?.floodProbability?.value ?? 82;

  return (
    <div className="pt-16 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="text-[11px] font-semibold text-sky-700 tracking-[0.18em] mb-2">RAINFALL PREDICTION</div>
            <h1 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-tight">Heavy Rainfall Forecast Engine</h1>
          </div>
          <div className="flex items-center gap-2">
            <DemoBadge label="LIVE SATELLITE & RADAR" tone="green"/>
            <button onClick={loadData} disabled={loading}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md px-2.5 py-1.5 transition">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}/> Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { l: 'AVG 24H RAINFALL', v: avgRain, u: 'mm', Icon: CloudRain, c: 'text-sky-600' },
            { l: 'PEAK STATION', v: maxRain, u: 'mm', Icon: TrendingUp, c: 'text-blue-600' },
            { l: 'HEAVY RAIN PROB.', v: highRainProb, u: '%', Icon: Radar, c: 'text-orange-600' },
            { l: 'CONFIDENCE', v: 82, u: '%', Icon: Cpu, c: 'text-emerald-600' },
          ].map((k, i) => (
            <div key={i} className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] font-semibold text-slate-500 tracking-[0.14em]">{k.l}</div>
                <k.Icon className={`w-4 h-4 ${k.c}`}/>
              </div>
              <div className="flex items-baseline gap-1.5">
                <div className="text-3xl font-semibold text-slate-900 tabular-nums">{loading ? '—' : k.v}</div>
                <div className="text-sm text-slate-500">{k.u}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Rainfall Timeline — Observed vs Forecast</h3>
                  <p className="text-xs text-slate-500">Kolkata region • last 12h + next 12h</p>
                </div>
                <DemoBadge/>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeline}>
                  <defs>
                    <linearGradient id="obs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4}/><stop offset="100%" stopColor="#0ea5e9" stopOpacity={0}/></linearGradient>
                    <linearGradient id="fc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e40af" stopOpacity={0.35}/><stop offset="100%" stopColor="#1e40af" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3"/>
                  <XAxis dataKey="hour" fontSize={11} stroke="#94a3b8"/>
                  <YAxis fontSize={11} stroke="#94a3b8" unit=" mm"/>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}/>
                  <Legend wrapperStyle={{ fontSize: 11 }}/>
                  <Area type="monotone" dataKey="observed" stroke="#0ea5e9" fill="url(#obs)" name="Observed" strokeWidth={2}/>
                  <Area type="monotone" dataKey="forecast" stroke="#1e40af" fill="url(#fc)" name="Forecast" strokeDasharray="4 4" strokeWidth={2}/>
                  <ReferenceLine x="12:00" stroke="#f59e0b" strokeDasharray="2 2" label={{ value: 'NOW', fill: '#f59e0b', fontSize: 10 }}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900">Live Weather Station Observations</h3>
                {loading && <span className="text-[10px] text-slate-400 animate-pulse">Loading live data…</span>}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th className="text-left py-2 font-semibold">Station</th>
                      <th className="text-right py-2 font-semibold">State</th>
                      <th className="text-right py-2 font-semibold">24h Rain</th>
                      <th className="text-right py-2 font-semibold">Temp</th>
                      <th className="text-right py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stations.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 text-slate-800 font-medium">{s.name}</td>
                        <td className="py-2.5 text-right text-slate-500 text-xs">{s.state || s.code}</td>
                        <td className="py-2.5 text-right tabular-nums font-semibold">
                          <span className={s.rain24 >= 100 ? 'text-red-600' : s.rain24 >= 50 ? 'text-amber-600' : 'text-slate-800'}>
                            {s.rain24} mm
                          </span>
                        </td>
                        <td className="py-2.5 text-right tabular-nums text-slate-600">{s.temp}°C</td>
                        <td className="py-2.5 text-right">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            s.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' :
                            s.status === 'DELAYED' ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-700'
                          }`}>{s.status}</span>
                        </td>
                      </tr>
                    ))}
                    {loading && [1,2,3,4].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="py-3"><div className="h-3 bg-slate-100 rounded w-3/4"/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="text-[11px] font-semibold text-slate-500 tracking-[0.14em] mb-3">DATA STREAMS</div>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Radar className="w-4 h-4 text-sky-600"/> Doppler Radar</span><DemoBadge/></li>
                <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Satellite className="w-4 h-4 text-blue-600"/> Satellite</span><DemoBadge/></li>
                <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Cpu className="w-4 h-4 text-emerald-600"/> NWP Ensemble</span><DemoBadge tone="green" label="READY"/></li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="text-[11px] font-semibold text-slate-500 tracking-[0.14em] mb-3">AI RAINFALL PREDICTION</div>
              <p className="text-sm text-slate-600 mb-4">Runs the fusion engine on latest observations and forecasts heavy rainfall probability.</p>
              <Button onClick={run} disabled={running} className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11">
                <Play className="w-4 h-4 mr-2"/> {running ? 'Running…' : 'RUN AI RAINFALL PREDICTION'}
              </Button>
              {(running || result) && (
                <div className="mt-4">
                  <ProcessingSteps steps={STEPS} active={step} done={!running && result}/>
                </div>
              )}
              {result && (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-[11px] font-semibold text-emerald-700 tracking-wider mb-2">RESULT</div>
                  <div className="text-2xl font-semibold text-slate-900 tabular-nums">{result.forecastMm} <span className="text-sm text-slate-500">mm / {result.window}</span></div>
                  <div className="text-xs text-slate-600 mt-1">Confidence: <span className="font-semibold">{Math.round(result.confidence * 100)}%</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
