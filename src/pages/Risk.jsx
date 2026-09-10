import React, { useEffect, useState } from 'react';
import MapView from '../components/MapView';
import { DemoBadge, RiskBadge } from '../components/DemoBadge';
import { INFRA_EXPOSURE, RISK_MATRIX } from '../data/mockData';
import { api } from '../services/api';
import { Users, Hospital, School, TrafficCone, Zap, Route, ShieldAlert, RefreshCw } from 'lucide-react';

export default function Risk() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const s = await api.getStates();
    setStates(s);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const sorted = states.slice().sort((a, b) => b.prob - a.prob);
  const criticalCount = states.filter(s => s.risk === 'CRITICAL' || s.risk === 'HIGH').length;
  const overallRisk = states.some(s => s.risk === 'CRITICAL') ? 'CRITICAL' : states.some(s => s.risk === 'HIGH') ? 'HIGH' : 'MODERATE';

  return (
    <div className="pt-16 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="text-[11px] font-semibold text-sky-700 tracking-[0.18em] mb-2">RISK ASSESSMENT</div>
            <h1 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-tight">Hazard × Exposure × Vulnerability</h1>
          </div>
          <div className="flex items-center gap-2">
            <DemoBadge label="ACTIVE ASSESSMENT" tone="green"/>
            <button onClick={loadData} disabled={loading}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md px-2.5 py-1.5 transition">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}/> Refresh
            </button>
          </div>
        </div>

        {/* Formula */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4 items-center">
            {[
              { l: 'HAZARD', v: 'Rainfall + Flood Prob.', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
              { l: 'EXPOSURE', v: 'Population + Assets', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
              { l: 'VULNERABILITY', v: 'Terrain + Access', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
              { l: 'RISK', v: 'Combined Score', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
            ].map((k, i) => (
              <div key={i} className="relative">
                <div className={`rounded-lg border ${k.border} ${k.bg} p-4`}>
                  <div className={`text-[10px] font-semibold tracking-[0.16em] ${k.text}`}>{k.l}</div>
                  <div className="text-sm font-semibold text-slate-900 mt-1">{k.v}</div>
                </div>
                {i < 3 && <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-slate-400 font-semibold">{i < 2 ? '+' : '='}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Map + table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">State-level Risk Map</h3>
              <MapView height={480} showStations={false} showInundation={false}/>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900">Live Risk by State</h3>
                {loading && <span className="text-[10px] text-slate-400 animate-pulse">Fetching live telemetry…</span>}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th className="text-left py-2 font-semibold">State</th>
                      <th className="text-right py-2 font-semibold">24h Rainfall</th>
                      <th className="text-right py-2 font-semibold">Flood Prob.</th>
                      <th className="text-right py-2 font-semibold">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sorted.map(s => (
                      <tr key={s.code} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 text-slate-800 font-medium">{s.name}</td>
                        <td className="py-2.5 text-right tabular-nums">
                          <span className={s.rainfall >= 150 ? 'text-red-600 font-semibold' : s.rainfall >= 80 ? 'text-amber-600 font-semibold' : 'text-slate-700'}>
                            {s.rainfall} mm
                          </span>
                        </td>
                        <td className="py-2.5 text-right tabular-nums font-semibold">{s.prob}%</td>
                        <td className="py-2.5 text-right"><RiskBadge level={s.risk}/></td>
                      </tr>
                    ))}
                    {loading && [1,2,3].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="py-3"><div className="h-3 bg-slate-100 rounded w-2/3"/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-red-600"/>
                <h3 className="text-sm font-semibold text-slate-900">Risk Levels</h3>
              </div>
              <div className="space-y-2">
                {RISK_MATRIX.map(r => (
                  <div key={r.level} className="flex items-center justify-between p-2.5 rounded border" style={{ background: r.bg, borderColor: r.color + '33' }}>
                    <span className="text-sm font-semibold" style={{ color: r.color }}>{r.level}</span>
                    <span className="text-xs tabular-nums" style={{ color: r.color }}>{r.range}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Exposure Snapshot</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-700"><Users className="w-4 h-4 text-sky-600"/>Population at risk</span><span className="font-semibold tabular-nums">{(INFRA_EXPOSURE.population/1e6).toFixed(2)}M</span></li>
                <li className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-700"><Hospital className="w-4 h-4 text-red-500"/>Hospitals</span><span className="font-semibold tabular-nums">{INFRA_EXPOSURE.hospitals}</span></li>
                <li className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-700"><School className="w-4 h-4 text-purple-500"/>Schools</span><span className="font-semibold tabular-nums">{INFRA_EXPOSURE.schools}</span></li>
                <li className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-700"><TrafficCone className="w-4 h-4 text-amber-600"/>Bridges</span><span className="font-semibold tabular-nums">{INFRA_EXPOSURE.bridges}</span></li>
                <li className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-700"><Route className="w-4 h-4 text-teal-600"/>Roads exposed</span><span className="font-semibold tabular-nums">{INFRA_EXPOSURE.roadsKm} km</span></li>
                <li className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-700"><Zap className="w-4 h-4 text-amber-500"/>Power stations</span><span className="font-semibold tabular-nums">{INFRA_EXPOSURE.powerStations}</span></li>
              </ul>
            </div>

            <div className="bg-slate-900 rounded-lg p-5 text-white">
              <div className="text-[10px] font-semibold text-sky-300 tracking-[0.16em] mb-2">OVERALL NATIONAL RISK</div>
              <div className={`font-serif text-4xl font-semibold ${overallRisk === 'CRITICAL' ? 'text-red-400' : overallRisk === 'HIGH' ? 'text-orange-400' : 'text-amber-400'}`}>
                {overallRisk}
              </div>
              <div className="text-sm text-slate-300 mt-1">{criticalCount} states at HIGH+ risk over next 24h.</div>
              <div className="mt-4 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${overallRisk === 'CRITICAL' ? 'from-orange-400 to-red-600' : 'from-amber-400 to-orange-500'}`}
                  style={{ width: `${Math.min(100, criticalCount * 14 + 20)}%` }}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
