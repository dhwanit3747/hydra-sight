import React from 'react';
import { Waves } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-md bg-slate-900 flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" strokeWidth={2.2}/>
              </div>
              <div>
                <div className="text-[15px] font-semibold text-slate-900 tracking-tight">HydroSense AI</div>
                <div className="text-[10px] tracking-[0.18em] font-medium text-slate-500">FLOOD INTELLIGENCE</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Real-time AI/ML-driven heavy-rainfall early-warning, hydrological river discharge and flood-inundation forecasting platform for India.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              OPERATIONAL SYSTEM • Real-time Data Feed Active
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-500 tracking-[0.18em] mb-3">PLATFORM</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Command Center</li>
              <li>Rainfall Prediction</li>
              <li>Inundation Modeling</li>
              <li>Risk Assessment</li>
              <li>Active Alerts</li>
            </ul>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-500 tracking-[0.18em] mb-3">DATA SOURCES</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Open-Meteo Global Hydrology</li>
              <li>Doppler Radar Network</li>
              <li>INSAT Satellite Telemetry</li>
              <li>NWP Ensemble Models</li>
              <li>Automated Weather Stations</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>© 2026 HydroSense AI — Flood Intelligence &amp; Inundation System for India.</div>
          <div>Turn flood forecasts into actionable flood intelligence.</div>
        </div>
      </div>
    </footer>
  );
}
