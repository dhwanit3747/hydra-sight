import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, MapPin, Clock, Map, Bell } from 'lucide-react';
import { Button } from './ui/button';

const styles = {
  CRITICAL: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500', icon: AlertTriangle },
  WARNING: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500', icon: AlertCircle },
  WATCH: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500', icon: AlertCircle },
  INFORMATION: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', dot: 'bg-sky-500', icon: Info },
};

// Map location names to approximate coordinates for map link
const LOCATION_COORDS = {
  'Hooghly': [22.55, 88.35],
  'Cuttack': [20.46, 85.88],
  'Guwahati': [26.14, 91.74],
  'Bhagalpur': [25.25, 86.98],
  'Ernakulam': [10.01, 76.33],
  'Kolkata': [22.57, 88.36],
};

function getMapUrl(location) {
  const key = Object.keys(LOCATION_COORDS).find(k => location.includes(k));
  if (key) {
    const [lat, lon] = LOCATION_COORDS[key];
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=11`;
  }
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(location)}`;
}

export default function AlertCard({ alert, onRefresh }) {
  const [ackStatus, setAckStatus] = useState(alert.status);
  const [alertGenerated, setAlertGenerated] = useState(false);

  const s = styles[alert.level] || styles.INFORMATION;
  const Icon = s.icon;
  const isAcked = ackStatus === 'ACKNOWLEDGED';

  const acknowledge = () => {
    setAckStatus('ACKNOWLEDGED');
    // In a real system this would call an API
  };

  const generateAlert = () => {
    setAlertGenerated(true);
    setTimeout(() => setAlertGenerated(false), 3000);
  };

  return (
    <div className={`rounded-lg border ${s.border} ${s.bg} p-4 hover:shadow-sm transition-shadow`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 w-8 h-8 rounded-md ${s.dot} bg-opacity-15 flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${s.text}`} strokeWidth={2.4} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-bold tracking-[0.14em] ${s.text}`}>{alert.level}</span>
            <span className="text-[10px] text-slate-400">•</span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3"/>{alert.time}</span>
            {isAcked && (
              <span className="ml-auto text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3"/> ACKNOWLEDGED
              </span>
            )}
            {alertGenerated && (
              <span className="ml-auto text-[10px] font-semibold text-sky-700 flex items-center gap-1">
                <Bell className="w-3 h-3"/> Sent!
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0"/>
            <div className="text-sm font-semibold text-slate-900 truncate">{alert.location}</div>
          </div>
          <div className="text-xs text-slate-600 mb-2">{alert.trigger}</div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 mb-3">
            <span>Prob: <span className="font-semibold text-slate-700">{alert.prob}%</span></span>
            <span>Area: <span className="font-semibold text-slate-700">{alert.area} km²</span></span>
          </div>
          <div className="text-[11px] text-slate-700 bg-white rounded border border-slate-200 px-2.5 py-1.5 mb-3">
            <span className="font-semibold">Action: </span>{alert.action}
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={getMapUrl(alert.location)} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                <Map className="w-3 h-3"/> View on Map
              </Button>
            </a>
            {!isAcked && (
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 hover:border-emerald-300 hover:text-emerald-700" onClick={acknowledge}>
                <CheckCircle2 className="w-3 h-3"/> Acknowledge
              </Button>
            )}
            <Button size="sm" className="h-7 text-xs bg-slate-900 hover:bg-slate-800 gap-1" onClick={generateAlert} disabled={alertGenerated}>
              <Bell className="w-3 h-3"/> {alertGenerated ? 'Sent!' : 'Generate Alert'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
