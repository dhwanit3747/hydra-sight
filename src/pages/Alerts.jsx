import React, { useEffect, useState } from 'react';
import AlertCard from '../components/AlertCard';
import { DemoBadge } from '../components/DemoBadge';
import { api } from '../services/api';
import { Button } from '../components/ui/button';
import { Bell, Filter, CheckCircle2, X, Send, Loader2 } from 'lucide-react';

const LEVELS = ['ALL', 'CRITICAL', 'WARNING', 'WATCH', 'INFORMATION'];

function DispatchModal({ onClose, alerts }) {
  const [location, setLocation] = useState('National Hydrological Network');
  const [channels, setChannels] = useState({ sms: true, email: true, ndma: true });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(null);

  const send = async () => {
    setSending(true);
    const result = await api.dispatchAlert({
      location,
      recipients: Math.floor(Math.random() * 900 + 100),
      channels: Object.keys(channels).filter(k => channels[k]),
    });
    setSent(result);
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-700"/>
            <span className="font-semibold text-slate-900 text-sm">Dispatch Alert</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 transition"><X className="w-4 h-4 text-slate-500"/></button>
        </div>

        {sent ? (
          /* Success state */
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-600"/>
            </div>
            <div className="text-base font-semibold text-slate-900 mb-1">Alert Dispatched</div>
            <div className="text-sm text-slate-500 mb-4">Message ID: <span className="font-mono text-slate-700">{sent.message_id}</span></div>
            <div className="bg-slate-50 rounded-lg p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="font-medium">{sent.location}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Recipients</span><span className="font-medium">{sent.recipients?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Channels</span><span className="font-medium">{sent.channels?.join(', ')}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-semibold text-emerald-700">{sent.status}</span></div>
            </div>
            <Button onClick={onClose} className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white h-10">Done</Button>
          </div>
        ) : (
          /* Form state */
          <div className="p-5 space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 tracking-wider">ALERT LOCATION / SCOPE</label>
              <select value={location} onChange={e => setLocation(e.target.value)}
                className="mt-1.5 w-full text-sm border border-slate-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300">
                <option>National Hydrological Network</option>
                {alerts.filter(a => a.level !== 'INFORMATION').map(a => (
                  <option key={a.id}>{a.location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 tracking-wider">DISPATCH CHANNELS</label>
              <div className="mt-2 space-y-2">
                {[
                  { key: 'sms', label: 'SMS Broadcast (NDMA/IMD)', desc: 'Sends to registered district officers' },
                  { key: 'email', label: 'Email Alert', desc: 'State disaster management authorities' },
                  { key: 'ndma', label: 'NDMA Portal', desc: 'National Disaster Management Authority' },
                ].map(ch => (
                  <label key={ch.key} className="flex items-center gap-3 p-2.5 rounded-md border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                    <input type="checkbox" checked={channels[ch.key]} onChange={e => setChannels(p => ({ ...p, [ch.key]: e.target.checked }))}
                      className="w-4 h-4 accent-slate-800"/>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{ch.label}</div>
                      <div className="text-[11px] text-slate-500">{ch.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-[11px] text-amber-700">
              This is a <b>demo dispatch</b>. In production, this triggers real SMS/email to registered NDMA officers.
            </div>

            <div className="flex gap-2 pt-1">
              <Button onClick={onClose} variant="outline" className="flex-1 h-10">Cancel</Button>
              <Button onClick={send} disabled={sending || !Object.values(channels).some(Boolean)}
                className="flex-1 h-10 bg-slate-900 hover:bg-slate-800 text-white">
                {sending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Dispatching…</> : <><Send className="w-4 h-4 mr-2"/>Dispatch Alert</>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [showDispatch, setShowDispatch] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    setLoading(true);
    const a = await api.getAlerts();
    setAlerts(a);
    setLoading(false);
  };

  useEffect(() => { loadAlerts(); }, []);

  const filtered = filter === 'ALL' ? alerts : alerts.filter(a => a.level === filter);
  const counts = LEVELS.reduce((acc, l) => {
    acc[l] = l === 'ALL' ? alerts.length : alerts.filter(a => a.level === l).length;
    return acc;
  }, {});

  return (
    <div className="pt-16 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="text-[11px] font-semibold text-sky-700 tracking-[0.18em] mb-2">ALERTS & NOTIFICATIONS</div>
            <h1 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-tight">Active Flood Alerts</h1>
          </div>
          <div className="flex gap-2">
            <DemoBadge label="REAL-TIME ALERTS" tone="green"/>
            <Button onClick={() => setShowDispatch(true)} className="bg-slate-900 hover:bg-slate-800 text-white h-9">
              <Bell className="w-3.5 h-3.5 mr-1.5"/> Dispatch Alert
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {[
            { l: 'CRITICAL', c: 'text-red-600 bg-red-50 border-red-200' },
            { l: 'WARNING', c: 'text-orange-600 bg-orange-50 border-orange-200' },
            { l: 'WATCH', c: 'text-amber-600 bg-amber-50 border-amber-200' },
            { l: 'INFORMATION', c: 'text-sky-600 bg-sky-50 border-sky-200' },
          ].map(({l, c}) => (
            <div key={l} className={`rounded-lg border ${c} p-4`}>
              <div className="text-[10px] font-semibold tracking-[0.14em]">{l}</div>
              <div className="text-3xl font-semibold tabular-nums mt-1">{loading ? '—' : (counts[l] || 0)}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4 flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-500"/>
          {LEVELS.map(l => (
            <button key={l} onClick={() => setFilter(l)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                filter === l ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}>
              {l} <span className="ml-1 text-[10px] opacity-70">{counts[l] || 0}</span>
            </button>
          ))}
          <div className="ml-auto text-[10px] text-slate-500">Live alerts from Open-Meteo river telemetry + IMD thresholds.</div>
        </div>

        <div className="space-y-3">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 animate-pulse h-32"/>
            ))
          ) : (
            <>
              {filtered.map(a => <AlertCard key={a.id} alert={a} onRefresh={loadAlerts}/>)}
              {filtered.length === 0 && (
                <div className="text-center py-16 text-slate-500 bg-white border border-slate-200 rounded-lg">No alerts at this level.</div>
              )}
            </>
          )}
        </div>
      </div>

      {showDispatch && <DispatchModal onClose={() => setShowDispatch(false)} alerts={alerts}/>}
    </div>
  );
}
