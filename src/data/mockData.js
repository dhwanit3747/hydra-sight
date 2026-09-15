// HydroSense AI — Deterministic Demo Dataset (India-wide flood scenario)
// Scenario: Heavy monsoon rainfall system affecting East & South India

export const SCENARIO = {
  id: 'IND-MON-2026-07',
  name: 'Monsoon Depression — East Coast System',
  timestamp: '2026-07-14T09:30:00Z',
  epicenter: { lat: 22.5726, lng: 88.3639, name: 'Kolkata, WB' },
};

export const KPI = {
  currentRainfall: { value: 87.4, unit: 'mm', change: '+18.2', trend: 'up' },
  forecastRainfall: { value: 214, unit: 'mm/24h', change: 'HEAVY', trend: 'up' },
  floodProbability: { value: 78, unit: '%', change: '+12', trend: 'up' },
  predictedInundation: { value: 342.8, unit: 'km²', change: '+41', trend: 'up' },
  overallRisk: { value: 'HIGH', color: '#dc2626' },
};

export const DATA_SOURCES = [
  { id: 'weather', name: 'Weather (IMD / Open-Meteo)', status: 'CONNECTED', latency: '142ms', freshness: 'live' },
  { id: 'radar', name: 'Doppler Radar (IMD DWR)', status: 'CONNECTED', latency: '260ms', freshness: 'live' },
  { id: 'satellite', name: 'Satellite (INSAT-3DR)', status: 'CONNECTED', latency: '390ms', freshness: '15m' },
  { id: 'nwp', name: 'NWP Models (ECMWF/GFS)', status: 'READY', latency: '210ms', freshness: '1h' },
  { id: 'stations', name: 'Ground Stations (AWS Network)', status: 'CONNECTED', latency: '88ms', freshness: 'live' },
  { id: 'ai_rain', name: 'AI Rainfall Engine', status: 'READY', latency: '—', freshness: 'ready' },
  { id: 'ai_inund', name: 'Inundation Engine', status: 'READY', latency: '—', freshness: 'ready' },
  { id: 'ai_alert', name: 'Alert Engine', status: 'READY', latency: '—', freshness: 'ready' },
];

// India state-level rainfall / risk snapshot
export const STATE_DATA = [
  { code: 'WB', name: 'West Bengal', center: [22.98, 87.85], rainfall: 187, risk: 'CRITICAL', prob: 84 },
  { code: 'OD', name: 'Odisha', center: [20.94, 84.80], rainfall: 152, risk: 'HIGH', prob: 76 },
  { code: 'AS', name: 'Assam', center: [26.20, 92.94], rainfall: 168, risk: 'HIGH', prob: 71 },
  { code: 'BR', name: 'Bihar', center: [25.10, 85.31], rainfall: 96, risk: 'MODERATE', prob: 54 },
  { code: 'MH', name: 'Maharashtra', center: [19.75, 75.71], rainfall: 74, risk: 'MODERATE', prob: 48 },
  { code: 'KL', name: 'Kerala', center: [10.85, 76.27], rainfall: 118, risk: 'HIGH', prob: 68 },
  { code: 'TN', name: 'Tamil Nadu', center: [11.13, 78.66], rainfall: 62, risk: 'MODERATE', prob: 41 },
  { code: 'KA', name: 'Karnataka', center: [15.32, 75.71], rainfall: 58, risk: 'LOW', prob: 32 },
  { code: 'GJ', name: 'Gujarat', center: [22.26, 71.19], rainfall: 42, risk: 'LOW', prob: 21 },
  { code: 'UP', name: 'Uttar Pradesh', center: [26.85, 80.94], rainfall: 51, risk: 'LOW', prob: 28 },
  { code: 'MP', name: 'Madhya Pradesh', center: [22.97, 78.65], rainfall: 47, risk: 'LOW', prob: 24 },
  { code: 'AP', name: 'Andhra Pradesh', center: [15.91, 79.74], rainfall: 89, risk: 'MODERATE', prob: 52 },
  { code: 'JH', name: 'Jharkhand', center: [23.61, 85.28], rainfall: 112, risk: 'HIGH', prob: 63 },
  { code: 'CG', name: 'Chhattisgarh', center: [21.28, 81.87], rainfall: 78, risk: 'MODERATE', prob: 44 },
];

// Weather stations (major)
export const STATIONS = [
  { id: 's1', name: 'Kolkata AWS', pos: [22.5726, 88.3639], rain24: 187, temp: 27.4, status: 'ACTIVE' },
  { id: 's2', name: 'Bhubaneswar AWS', pos: [20.2961, 85.8245], rain24: 142, temp: 26.9, status: 'ACTIVE' },
  { id: 's3', name: 'Guwahati AWS', pos: [26.1445, 91.7362], rain24: 168, temp: 25.1, status: 'ACTIVE' },
  { id: 's4', name: 'Patna AWS', pos: [25.5941, 85.1376], rain24: 96, temp: 28.2, status: 'ACTIVE' },
  { id: 's5', name: 'Mumbai AWS', pos: [19.076, 72.8777], rain24: 68, temp: 28.9, status: 'DELAYED' },
  { id: 's6', name: 'Kochi AWS', pos: [9.9312, 76.2673], rain24: 118, temp: 26.4, status: 'ACTIVE' },
  { id: 's7', name: 'Chennai AWS', pos: [13.0827, 80.2707], rain24: 62, temp: 29.1, status: 'ACTIVE' },
  { id: 's8', name: 'Ranchi AWS', pos: [23.3441, 85.3096], rain24: 112, temp: 25.8, status: 'ACTIVE' },
];

// Predicted inundation polygons (illustrative)
export const INUNDATION_ZONES = [
  { id: 'i1', name: 'Hooghly Basin', level: 'CRITICAL', prob: 0.86, area: 142.3,
    coords: [[22.65, 88.20], [22.80, 88.42], [22.55, 88.55], [22.38, 88.48], [22.32, 88.28], [22.45, 88.15]] },
  { id: 'i2', name: 'Mahanadi Delta', level: 'HIGH', prob: 0.74, area: 98.4,
    coords: [[20.55, 86.30], [20.72, 86.55], [20.48, 86.75], [20.30, 86.62], [20.28, 86.40]] },
  { id: 'i3', name: 'Brahmaputra Bend', level: 'HIGH', prob: 0.71, area: 76.2,
    coords: [[26.35, 91.55], [26.48, 91.85], [26.25, 92.05], [26.05, 91.90], [26.10, 91.60]] },
  { id: 'i4', name: 'Ganga-Kosi Confluence', level: 'MODERATE', prob: 0.58, area: 62.5,
    coords: [[25.75, 87.10], [25.90, 87.40], [25.65, 87.55], [25.50, 87.35]] },
  { id: 'i5', name: 'Periyar-Vembanad Basin', level: 'MODERATE', prob: 0.46, area: 41.2,
    coords: [[10.12, 76.22], [10.18, 76.45], [10.05, 76.52], [9.85, 76.42], [9.88, 76.25]] },
];

// Critical infrastructure markers
export const INFRASTRUCTURE = [
  { id: 'h1', type: 'hospital', name: 'SSKM Hospital', pos: [22.5390, 88.3448] },
  { id: 'h2', type: 'hospital', name: 'AIIMS Bhubaneswar', pos: [20.1852, 85.7999] },
  { id: 'b1', type: 'bridge', name: 'Howrah Bridge', pos: [22.5851, 88.3468] },
  { id: 'b2', type: 'bridge', name: 'Bhupen Hazarika Setu', pos: [27.7889, 95.4353] },
  { id: 'p1', type: 'power', name: 'Farakka Barrage', pos: [24.8033, 87.9297] },
  { id: 's1', type: 'school', name: 'Presidency Univ.', pos: [22.5750, 88.3639] },
  { id: 'a1', type: 'airport', name: 'NSCBI Airport', pos: [22.6547, 88.4467] },
  { id: 'a2', type: 'airport', name: 'Biju Patnaik Airport', pos: [20.2444, 85.8178] },
];

export const ALERTS = [
  { id: 'a1', level: 'CRITICAL', location: 'Hooghly District, WB', trigger: 'Rainfall >180mm/12h + Inundation prob 86%',
    prob: 86, area: 142.3, time: '09:14 IST', action: 'Evacuate low-lying wards, deploy NDRF', status: 'ACTIVE' },
  { id: 'a2', level: 'WARNING', location: 'Cuttack, Odisha', trigger: 'Mahanadi swelling + heavy rainfall forecast',
    prob: 74, area: 98.4, time: '09:22 IST', action: 'Alert district administration, prepare shelters', status: 'ACTIVE' },
  { id: 'a3', level: 'WARNING', location: 'Guwahati Metro, Assam', trigger: 'Brahmaputra water level +2.1m',
    prob: 71, area: 76.2, time: '08:47 IST', action: 'Monitor river gauges, restrict low-bridge traffic', status: 'ACTIVE' },
  { id: 'a4', level: 'WATCH', location: 'Bhagalpur, Bihar', trigger: 'Ganga-Kosi confluence pressure rising',
    prob: 58, area: 62.5, time: '07:30 IST', action: 'Pre-position relief supplies', status: 'ACKNOWLEDGED' },
  { id: 'a5', level: 'INFORMATION', location: 'Ernakulam, Kerala', trigger: 'Rainfall trend upward next 24h',
    prob: 42, area: 24.1, time: '06:15 IST', action: 'Informational bulletin issued', status: 'ACTIVE' },
];

// Timeseries: 24h rainfall + forecast
export const RAINFALL_TIMELINE = Array.from({ length: 24 }, (_, i) => {
  const observed = i < 12 ? 4 + Math.sin(i / 2) * 3 + i * 1.6 : null;
  const forecast = i >= 10 ? 6 + Math.cos(i / 3) * 2 + (i - 10) * 2.1 : null;
  const bound = forecast ? forecast * 0.35 : null;
  return {
    hour: `${i.toString().padStart(2, '0')}:00`,
    observed: observed ? +observed.toFixed(1) : null,
    forecast: forecast ? +forecast.toFixed(1) : null,
    upper: forecast ? +(forecast + bound).toFixed(1) : null,
    lower: forecast ? +(forecast - bound).toFixed(1) : null,
  };
});

// Precise historical flood events — real Indian disasters (CWC, NDMA, IMD records)
export const HISTORICAL_EVENTS = [
  {
    id: 'h1',
    name: 'Cyclone Amphan — West Bengal & Odisha',
    date: '2020-05-20',
    duration_days: 2,
    category: 'Super Cyclone',
    peakRain: 241,
    peakRainStation: 'Kolkata NSCBI / Digha',
    extent: 4820,
    deaths: 98,
    displaced: 4900000,
    damageInrCr: 102000,
    states: ['West Bengal', 'Odisha'],
    description: 'Super Cyclonic Storm Amphan made landfall between Digha (WB) and Hatiya Island (Bangladesh) with sustained winds of 185 km/h, generating a 5 m storm surge across the Sundarbans. All 23 districts of WB and 8 districts of Odisha declared disaster zones.',
    peakDischarge_m3s: 12400,
    accuracy: null,
  },
  {
    id: 'h2',
    name: '2018 Kerala Great Deluge',
    date: '2018-08-15',
    duration_days: 14,
    category: 'Extreme Rainfall',
    peakRain: 414,
    peakRainStation: 'Cherrapunji / Munnar (Idukki)',
    extent: 6320,
    deaths: 483,
    displaced: 1400000,
    damageInrCr: 31000,
    states: ['Kerala'],
    description: 'Worst Kerala floods since the Great Flood of 1924. All 14 districts severely impacted; Idukki and Ernakulam worst hit. 35+ dams opened simultaneously including Idukki and Cheruthoni. Central and southern districts completely isolated for 5 days.',
    peakDischarge_m3s: 18700,
    accuracy: null,
  },
  {
    id: 'h3',
    name: '2019 Bihar–Assam Monsoon Floods',
    date: '2019-07-14',
    duration_days: 21,
    category: 'River Flooding',
    peakRain: 178,
    peakRainStation: 'Patna / Guwahati AWS',
    extent: 3140,
    deaths: 302,
    displaced: 12800000,
    damageInrCr: 8700,
    states: ['Bihar', 'Assam'],
    description: 'Concurrent flooding on the Ganga, Gandak, Kosi and Brahmaputra river systems. 19 districts of Bihar and 30 districts of Assam submerged simultaneously. Kosi River crossed danger level by 2.4 m at Birpur gauging station.',
    peakDischarge_m3s: 8900,
    accuracy: null,
  },
  {
    id: 'h4',
    name: '2013 Uttarakhand Cloudburst (Kedarnath Disaster)',
    date: '2013-06-16',
    duration_days: 4,
    category: 'Flash Flood',
    peakRain: 340,
    peakRainStation: 'Kedarnath / Gauchar',
    extent: 1210,
    deaths: 5748,
    displaced: 100000,
    damageInrCr: 16000,
    states: ['Uttarakhand'],
    description: 'Multi-day extreme cloudburst triggered catastrophic flash floods and over 4,500 landslides on the Mandakini, Alaknanda and Bhagirathi river systems. Kedarnath temple area devastated; 1 lakh+ pilgrims stranded during Char Dham Yatra. Declared national tragedy.',
    peakDischarge_m3s: 6800,
    accuracy: null,
  },
  {
    id: 'h5',
    name: '2015 Chennai Urban Floods',
    date: '2015-12-01',
    duration_days: 7,
    category: 'Urban Flooding',
    peakRain: 344,
    peakRainStation: 'Nungambakkam Observatory, Chennai',
    extent: 1820,
    deaths: 269,
    displaced: 3500000,
    damageInrCr: 20000,
    states: ['Tamil Nadu'],
    description: 'Unprecedented urban flooding submerged Chennai after 344 mm fell in 24 hours on 1 December 2015 — the highest single-day rainfall in 100 years. Chennai airport shut for 14 days. Chembarambakkam reservoir outflow peaked at 29,800 cusecs, inundating Madipakkam, Velachery and Porur.',
    peakDischarge_m3s: 4200,
    accuracy: null,
  },
  {
    id: 'h6',
    name: '2017 Mumbai Mega Floods',
    date: '2017-08-29',
    duration_days: 2,
    category: 'Urban Flooding',
    peakRain: 298,
    peakRainStation: 'Santacruz IMD Observatory',
    extent: 840,
    deaths: 22,
    displaced: 1200000,
    damageInrCr: 4200,
    states: ['Maharashtra'],
    description: '298 mm in 24 hours — the highest single-day August rainfall since 2005. Central, Western and Harbour rail lines suspended. Large parts of Sion, Kurla, Dharavi and Andheri submerged for 48+ hours. BMC deployed 98 pumps.',
    peakDischarge_m3s: 2900,
    accuracy: null,
  },
];

export const INFRA_EXPOSURE = {
  population: 4_820_000,
  hospitals: 42,
  schools: 318,
  bridges: 27,
  roadsKm: 1240,
  powerStations: 8,
};

export const RISK_MATRIX = [
  { level: 'LOW', color: '#16a34a', bg: '#dcfce7', range: '0–25%' },
  { level: 'MODERATE', color: '#ca8a04', bg: '#fef9c3', range: '25–55%' },
  { level: 'HIGH', color: '#ea580c', bg: '#ffedd5', range: '55–80%' },
  { level: 'CRITICAL', color: '#dc2626', bg: '#fee2e2', range: '80–100%' },
];
