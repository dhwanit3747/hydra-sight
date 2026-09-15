import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polygon, Popup, LayersControl, LayerGroup, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { STATE_DATA, STATIONS, INUNDATION_ZONES, INFRASTRUCTURE } from '../data/mockData';

const INDIA_CENTER = [22.5, 82.5];
const INDIA_BOUNDS = [[6.5, 68.0], [37.5, 97.5]];

const riskColor = { CRITICAL: '#dc2626', HIGH: '#ea580c', MODERATE: '#ca8a04', LOW: '#16a34a' };

function infraIcon(type) {
  const map = { hospital: '⚕', bridge: '≡', power: '⚡', school: '▢', airport: '✈' };
  const bg = { hospital: '#dc2626', bridge: '#0369a1', power: '#f59e0b', school: '#7c3aed', airport: '#0f766e' }[type] || '#334155';
  return L.divIcon({
    className: 'hydro-infra-icon',
    html: `<div style="background:${bg};color:white;width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.2);border:1.5px solid white;">${map[type] || '●'}</div>`,
    iconSize: [22, 22], iconAnchor: [11, 11],
  });
}

function Recenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => { if (center) map.flyTo(center, zoom || 6, { duration: 0.8 }); }, [center, zoom, map]);
  return null;
}

export default function MapView({
  height = 520,
  center = INDIA_CENTER,
  zoom = 5,
  showStates = true,
  showStations = true,
  showInundation = true,
  showInfrastructure = true,
  simulation = null,
  className = '',
  liveStations = null,
  liveZones = null,
}) {
  const mapRef = useRef();
  const stationsData = liveStations || STATIONS;
  const zonesData = (simulation && simulation.zones) ? simulation.zones : (liveZones || INUNDATION_ZONES);

  return (
    <div className={`relative w-full rounded-lg overflow-hidden border border-slate-200 ${className}`} style={{ height }}>
      <MapContainer
        center={center} zoom={zoom} minZoom={4} maxZoom={12}
        maxBounds={INDIA_BOUNDS} scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#eaf2f8' }}
        ref={mapRef}
      >
        <Recenter center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LayersControl position="topright">
          {showStates && (
            <LayersControl.Overlay checked name="State Risk">
              <LayerGroup>
                {STATE_DATA.map((s) => (
                  <CircleMarker key={s.code} center={s.center} radius={8 + s.prob / 10}
                    pathOptions={{ color: riskColor[s.risk], fillColor: riskColor[s.risk], fillOpacity: 0.55, weight: 1.5 }}>
                    <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
                      <div className="text-xs">
                        <div className="font-semibold">{s.name}</div>
                        <div>Rainfall: {s.rainfall} mm</div>
                        <div>Flood Prob: {s.prob}%</div>
                        <div>Risk: {s.risk}</div>
                      </div>
                    </Tooltip>
                  </CircleMarker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          )}

          {showInundation && (
            <LayersControl.Overlay checked name="Predicted Inundation">
              <LayerGroup>
                {zonesData.map((z) => (
                  <Polygon key={z.id} positions={z.coords}
                    pathOptions={{ color: riskColor[z.level], fillColor: riskColor[z.level], fillOpacity: 0.28, weight: 2, dashArray: '4 4' }}>
                    <Popup>
                      <div className="text-xs">
                        <div className="font-semibold text-sm mb-1">{z.name}</div>
                        <div>Level: <span className="font-semibold">{z.level}</span></div>
                        <div>Probability: {(z.prob * 100).toFixed(0)}%</div>
                        <div>Predicted area: {z.area} km²</div>
                        {z.river && <div>River: {z.river}</div>}
                        {z.discharge_m3s && <div>Discharge: {z.discharge_m3s} m³/s</div>}
                      </div>
                    </Popup>
                  </Polygon>
                ))}

              </LayerGroup>
            </LayersControl.Overlay>
          )}

          {showStations && (
            <LayersControl.Overlay checked name="Weather Stations">
              <LayerGroup>
                {stationsData.map((st) => (
                  <CircleMarker key={st.id} center={st.pos} radius={5}
                    pathOptions={{ color: '#0c4a6e', fillColor: st.status === 'DELAYED' ? '#f59e0b' : '#38bdf8', fillOpacity: 0.9, weight: 1.5 }}>
                    <Tooltip>
                      <div className="text-xs">
                        <div className="font-semibold">{st.name}</div>
                        <div>24h Rain: {st.rain24} mm</div>
                        <div>Temp: {st.temp}°C</div>
                        <div>Status: {st.status}</div>
                      </div>
                    </Tooltip>
                  </CircleMarker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          )}

          {showInfrastructure && (
            <LayersControl.Overlay checked name="Critical Infrastructure">
              <LayerGroup>
                {INFRASTRUCTURE.map((i) => (
                  <Marker key={i.id} position={i.pos} icon={infraIcon(i.type)}>
                    <Popup>
                      <div className="text-xs">
                        <div className="font-semibold">{i.name}</div>
                        <div className="capitalize">Type: {i.type}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          )}
        </LayersControl>
      </MapContainer>

      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur rounded-md border border-slate-200 shadow-sm px-3 py-2">
        <div className="text-[10px] font-semibold text-slate-500 tracking-[0.14em] mb-1.5">RISK LEGEND</div>
        <div className="flex items-center gap-3">
          {['LOW','MODERATE','HIGH','CRITICAL'].map((k) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: riskColor[k] }}/>
              <span className="text-[10px] text-slate-600">{k}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`absolute top-3 left-3 z-[400] backdrop-blur border rounded-md px-2.5 py-1 text-[10px] font-semibold tracking-wider ${
        simulation
          ? 'bg-sky-50/95 border-sky-200 text-sky-700'
          : 'bg-emerald-50/95 border-emerald-200 text-emerald-700'
      }`}>
        {simulation ? `SIMULATED • ${Math.round((simulation.probability||0)*100)}% • ${simulation.areaKm2||0} km²` : 'LIVE GIS TELEMETRY • ACTIVE MONITORING'}
      </div>
    </div>
  );
}
