import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import MapView from '../components/MapView';
import KPICard from '../components/KPICard';
import DataStatus from '../components/DataStatus';
import AlertCard from '../components/AlertCard';
import { DemoBadge, RiskBadge } from '../components/DemoBadge';
import { Building2, Hospital, TrafficCone, Zap, Plane } from 'lucide-react';

export default function Dashboard() {
  const [kpi, setKpi] = useState(null);
  const [sources, setSources] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stations, setStations] = useState([]);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    api.getKPI().then(setKpi);
    api.getSystemStatus().then(s => setSources(s.sources));
    api.getAlerts().then(setAlerts);
    api.getStations().then(setStations);
    api.getInundationZones().then(setZones);
  }, []);

  return (
    <div className="pt-16 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-[11px] font-semibold text-sky-700 tracking-[0.18em] mb-2">COMMAND CENTER</div>
            <h1 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-tight">National Flood Intelligence Overview</h1>
            <p className="text-sm text-slate-500 mt-1">Live Multi-Source Hydrological &amp; Doppler Radar Telemetry • Updated Continuous</p>
          </div>
          <div className="flex gap-2">
            <DemoBadge label="LIVE TELEMETRY" tone="green"/>
            <DemoBadge label="INDIA-WIDE" tone="blue"/>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {kpi && <>
            <KPICard label="CURRENT RAINFALL" value={kpi.currentRainfall.value} unit={kpi.currentRainfall.unit}
              change={`${kpi.currentRainfall.change} mm/6h`} trend="up" accent="sky"/>
            <KPICard label="FORECAST RAINFALL" value={kpi.forecastRainfall.value} unit={kpi.forecastRainfall.unit}
              change={kpi.forecastRainfall.change} trend="up" accent="blue"/>
            <KPICard label="FLOOD PROBABILITY" value={kpi.floodProbability.value} unit="%"
              change={`${kpi.floodProbability.change} pp / 24h`} trend="up" accent="orange"/>
            <KPICard label="PREDICTED INUNDATION" value={kpi.predictedInundation.value} unit="km²"
              change={`+${kpi.predictedInundation.change} km²`} trend="up" accent="orange"/>
            <KPICard label="OVERALL RISK" value={kpi.overallRisk.value} unit="" accent="red"/>
          </>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">India Flood Intelligence Map</h3>
                  <p className="text-xs text-slate-500">Zoom into any state • toggle layers from the top-right control</p>
                </div>
                <div className="flex gap-1.5">
                  {['NOW','+1H','+3H','+6H','+12H','+24H'].map((t,i) => (
                    <button key={t} className={`text-[10px] font-semibold px-2 py-1 rounded ${i===0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <MapView height={560} liveStations={stations.length ? stations : null} liveZones={zones.length ? zones : null}/>
            </div>

            {/* Prediction summary */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <div className="text-[11px] font-semibold text-slate-500 tracking-[0.14em] mb-2">PREDICTION SUMMARY</div>
                <div className="font-serif text-2xl text-slate-900 leading-tight">4 zones at high-to-critical flood risk over next 24h.</div>
                <div className="mt-3 text-xs text-slate-600">Model confidence: <span className="font-semibold text-slate-900">82%</span></div>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <div className="text-[11px] font-semibold text-slate-500 tracking-[0.14em] mb-3">CRITICAL INFRASTRUCTURE</div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Hospital className="w-4 h-4 text-red-500"/> Hospitals</span><span className="font-semibold">42</span></li>
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-purple-500"/> Schools</span><span className="font-semibold">318</span></li>
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><TrafficCone className="w-4 h-4 text-sky-600"/> Bridges</span><span className="font-semibold">27</span></li>
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500"/> Power</span><span className="font-semibold">8</span></li>
                  <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Plane className="w-4 h-4 text-teal-600"/> Airports</span><span className="font-semibold">3</span></li>
                </ul>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <div className="text-[11px] font-semibold text-slate-500 tracking-[0.14em] mb-3">RISK BY REGION</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between"><span className="text-slate-700">West Bengal</span><RiskBadge level="CRITICAL"/></li>
                  <li className="flex items-center justify-between"><span className="text-slate-700">Odisha</span><RiskBadge level="HIGH"/></li>
                  <li className="flex items-center justify-between"><span className="text-slate-700">Assam</span><RiskBadge level="HIGH"/></li>
                  <li className="flex items-center justify-between"><span className="text-slate-700">Kerala</span><RiskBadge level="HIGH"/></li>
                  <li className="flex items-center justify-between"><span className="text-slate-700">Bihar</span><RiskBadge level="MODERATE"/></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">
            <DataStatus sources={sources}/>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">Active Alerts</h3>
                <span className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">{alerts.filter(a => a.status === 'ACTIVE').length} ACTIVE</span>
              </div>
              <div className="space-y-3">
                {alerts.slice(0, 3).map(a => <AlertCard key={a.id} alert={a}/>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
