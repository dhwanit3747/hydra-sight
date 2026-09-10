import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar, Cell } from 'recharts';
import { DemoBadge } from '../components/DemoBadge';
import { Info, Users, CloudRain, MapPin, Calendar, TrendingUp, Zap } from 'lucide-react';

const CATEGORY_COLORS = {
  'Super Cyclone': '#7c3aed',
  'Extreme Rainfall': '#0284c7',
  'River Flooding': '#0369a1',
  'Flash Flood': '#dc2626',
  'Urban Flooding': '#ea580c',
};

function StatPill({ label, value, sub, color = 'text-slate-900' }) {
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-100 p-3">
      <div className="text-[10px] text-slate-500 font-semibold tracking-wider mb-1">{label}</div>
      <div className={`text-xl font-semibold tabular-nums ${color}`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function Historical() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHistoricalEvents().then(e => {
      setEvents(e);
      setSelected(e[0]);
      setLoading(false);
    });
  }, []);

  const timeline = selected ? Array.from({ length: 10 }, (_, i) => ({
    day: `D+${i}`,
    observed: Math.round(selected.peakRain * (0.15 + Math.sin(i / 2) * 0.4 + i * 0.02)),
    predicted: Math.round(selected.peakRain * (0.18 + Math.sin(i / 2) * 0.38 + i * 0.018)),
  })) : [];

  const extentBars = events.map(e => ({
    name: e.name.split('—')[0].trim().split(' ').slice(0, 2).join(' '),
    extent: e.extent,
    deaths: e.deaths,
    peakRain: e.peakRain,
  }));

  const fmtNum = n => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n);
  const catColor = c => CATEGORY_COLORS[c] || '#64748b';

  return (
    <div className="pt-16 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="text-[11px] font-semibold text-sky-700 tracking-[0.18em] mb-2">HISTORICAL ANALYSIS</div>
            <h1 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-tight">Past Events — Observed vs Predicted</h1>
            <p className="text-sm text-slate-500 mt-1">Real Indian disaster data — CWC, NDMA & IMD official records</p>
          </div>
          <DemoBadge label="OFFICIAL ARCHIVE" tone="blue"/>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Event archive list */}
          <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Event Archive ({events.length})</h3>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="animate-pulse h-20 bg-slate-100 rounded-lg"/>
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {events.map(e => (
                  <li key={e.id}>
                    <button onClick={() => setSelected(e)}
                      className={`w-full text-left p-3 rounded-md border transition ${
                        selected?.id === e.id ? 'bg-sky-50 border-sky-200' : 'border-slate-200 hover:bg-slate-50'
                      }`}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="text-sm font-semibold text-slate-900 leading-tight">{e.name}</div>
                        <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                          style={{ background: catColor(e.category) }}>
                          {e.category?.split(' ')[0]}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mb-2">{e.date} • {e.states?.join(', ')}</div>
                      <div className="grid grid-cols-3 gap-1 text-[10px]">
                        <span className="text-slate-600">Peak: <b className="tabular-nums text-slate-800">{e.peakRain}mm</b></span>
                        <span className="text-red-600">Deaths: <b>{e.deaths?.toLocaleString()}</b></span>
                        <span className="text-slate-600">Area: <b>{e.extent?.toLocaleString()}km²</b></span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-8 space-y-6">
            {selected && (
              <>
                {/* Event header */}
                <div className="bg-white rounded-lg border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{selected.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> {selected.date}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {selected.states?.join(', ')}</span>
                        <span>{selected.duration_days} day{selected.duration_days > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded text-white"
                      style={{ background: catColor(selected.category) }}>
                      {selected.category}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{selected.description}</p>

                  {/* Key stats grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <StatPill label="PEAK 24H RAINFALL" value={`${selected.peakRain} mm`} sub={selected.peakRainStation} color="text-sky-700"/>
                    <StatPill label="INUNDATION AREA" value={`${selected.extent?.toLocaleString()} km²`} sub="estimated extent"/>
                    <StatPill label="PEAK DISCHARGE" value={selected.peakDischarge_m3s ? `${(selected.peakDischarge_m3s/1000).toFixed(1)}K m³/s` : '—'} sub="river peak flow"/>
                    <StatPill label="FATALITIES" value={selected.deaths?.toLocaleString()} sub="confirmed deaths" color="text-red-700"/>
                    <StatPill label="DISPLACED" value={fmtNum(selected.displaced)} sub="people displaced" color="text-orange-700"/>
                    <StatPill label="ECONOMIC DAMAGE" value={`₹${(selected.damageInrCr/1000).toFixed(0)}K Cr`} sub="estimated loss" color="text-amber-700"/>
                  </div>
                </div>

                {/* Rainfall timeline chart */}
                <div className="bg-white rounded-lg border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-slate-900">{selected.name} — Rainfall Timeline</h3>
                    <span className="text-xs text-slate-500">{selected.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Observed vs model-predicted rainfall (illustrative reconstruction)</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={timeline}>
                      <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3"/>
                      <XAxis dataKey="day" fontSize={11} stroke="#94a3b8"/>
                      <YAxis fontSize={11} stroke="#94a3b8" unit=" mm"/>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}/>
                      <Legend wrapperStyle={{ fontSize: 11 }}/>
                      <Line type="monotone" dataKey="observed" stroke="#0ea5e9" name="Observed" strokeWidth={2} dot={false}/>
                      <Line type="monotone" dataKey="predicted" stroke="#1e40af" strokeDasharray="4 4" name="AI Predicted" strokeWidth={2} dot={false}/>
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                    <Info className="w-3.5 h-3.5 shrink-0"/>
                    <span><b>Model accuracy not computed.</b> Accuracy metrics will appear once ground-truth validation data is linked from CWC archives.</span>
                  </div>
                </div>
              </>
            )}

            {/* Bar chart — all events comparison */}
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Historical Flood Extent Comparison</h3>
              <p className="text-xs text-slate-500 mb-4">Estimated inundation area across all archived events</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={extentBars} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3"/>
                  <XAxis dataKey="name" fontSize={10} stroke="#94a3b8"/>
                  <YAxis fontSize={11} stroke="#94a3b8" unit=" km²"/>
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                    formatter={(v, n, p) => [`${v?.toLocaleString()} km²`, 'Extent']}
                  />
                  <Bar dataKey="extent" radius={[6, 6, 0, 0]}>
                    {extentBars.map((entry, index) => (
                      <Cell key={index}
                        fill={events[index] ? catColor(events[index].category) : '#0ea5e9'}
                        opacity={selected && events[index]?.id === selected.id ? 1 : 0.65}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
