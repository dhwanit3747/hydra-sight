import httpx
import asyncio
import time
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

# Key monitoring stations across India
STATIONS_CONFIG = [
    {"id": "s1", "name": "Kolkata Station (WB)", "lat": 22.5726, "lon": 88.3639, "state": "West Bengal", "code": "WB"},
    {"id": "s2", "name": "Bhubaneswar Station (OD)", "lat": 20.2961, "lon": 85.8245, "state": "Odisha", "code": "OD"},
    {"id": "s3", "name": "Guwahati Station (AS)", "lat": 26.1445, "lon": 91.7362, "state": "Assam", "code": "AS"},
    {"id": "s4", "name": "Patna Station (BR)", "lat": 25.5941, "lon": 85.1376, "state": "Bihar", "code": "BR"},
    {"id": "s5", "name": "Mumbai Station (MH)", "lat": 19.0760, "lon": 72.8777, "state": "Maharashtra", "code": "MH"},
    {"id": "s6", "name": "Kochi Station (KL)", "lat": 9.9312, "lon": 76.2673, "state": "Kerala", "code": "KL"},
    {"id": "s7", "name": "Chennai Station (TN)", "lat": 13.0827, "lon": 80.2707, "state": "Tamil Nadu", "code": "TN"},
    {"id": "s8", "name": "Ranchi Station (JH)", "lat": 23.3441, "lon": 85.3096, "state": "Jharkhand", "code": "JH"},
]

# Major river basins for Open-Meteo Flood API (river discharge in m3/s)
RIVER_BASINS = [
    {"id": "i1", "name": "Hooghly Basin", "lat": 22.55, "lon": 88.35, "river": "Hooghly / Bhagirathi",
     "coords": [[22.65, 88.20], [22.80, 88.42], [22.55, 88.55], [22.38, 88.48], [22.32, 88.28], [22.45, 88.15]]},
    {"id": "i2", "name": "Mahanadi Delta", "lat": 20.48, "lon": 86.50, "river": "Mahanadi",
     "coords": [[20.55, 86.30], [20.72, 86.55], [20.48, 86.75], [20.30, 86.62], [20.28, 86.40]]},
    {"id": "i3", "name": "Brahmaputra Bend", "lat": 26.25, "lon": 91.80, "river": "Brahmaputra",
     "coords": [[26.35, 91.55], [26.48, 91.85], [26.25, 92.05], [26.05, 91.90], [26.10, 91.60]]},
    {"id": "i4", "name": "Ganga-Kosi Confluence", "lat": 25.65, "lon": 87.40, "river": "Ganga / Kosi",
     "coords": [[25.75, 87.10], [25.90, 87.40], [25.65, 87.55], [25.50, 87.35]]},
]

class WeatherService:
    def __init__(self):
        self._cache: Dict[str, Any] = {}
        self._cache_ttl = 60  # seconds

    def _cache_get(self, key: str) -> Optional[Any]:
        entry = self._cache.get(key)
        if entry and (time.time() - entry["ts"]) < self._cache_ttl:
            return entry["data"]
        return None

    def _cache_set(self, key: str, data: Any) -> None:
        self._cache[key] = {"data": data, "ts": time.time()}

    async def fetch_real_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetch current weather, hourly rainfall & soil moisture from Open-Meteo"""
        cache_key = f"weather_{lat}_{lon}"
        cached = self._cache_get(cache_key)
        if cached is not None:
            return cached

        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}&longitude={lon}"
            f"&current=temperature_2m,relative_humidity_2m,precipitation,rain,surface_pressure,wind_speed_10m"
            f"&hourly=precipitation,rain,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm"
            f"&daily=precipitation_sum,precipitation_probability_max"
            f"&timezone=Asia/Kolkata&forecast_days=2"
        )
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    self._cache_set(cache_key, data)
                    return data
        except Exception as e:
            print(f"Open-Meteo weather fetch error for {lat},{lon}: {e}")
        return None

    async def fetch_river_discharge(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetch real-time hydrological river discharge from Open-Meteo Global Flood API"""
        cache_key = f"flood_{lat}_{lon}"
        cached = self._cache_get(cache_key)
        if cached is not None:
            return cached

        url = (
            f"https://flood-api.open-meteo.com/v1/flood"
            f"?latitude={lat}&longitude={lon}"
            f"&daily=river_discharge,river_discharge_mean,river_discharge_median,river_discharge_max"
            f"&forecast_days=7"
        )
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    self._cache_set(cache_key, data)
                    return data
        except Exception as e:
            print(f"Open-Meteo flood fetch error for {lat},{lon}: {e}")
        return None

    async def get_all_stations_telemetry(self) -> List[Dict[str, Any]]:
        """Fetch live telemetry for major Indian observation stations"""
        cache_key = "all_stations"
        cached = self._cache_get(cache_key)
        if cached is not None:
            return cached

        results = []
        tasks = [self.fetch_real_weather(s["lat"], s["lon"]) for s in STATIONS_CONFIG]
        weather_data = await asyncio.gather(*tasks, return_exceptions=True)

        for s, w in zip(STATIONS_CONFIG, weather_data):
            rain_24h = 0.0
            temp = 28.0
            status = "ACTIVE"
            if isinstance(w, dict) and "current" in w:
                temp = round(w["current"].get("temperature_2m", 28.0), 1)
                # Compute 24h precipitation sum from hourly or daily
                if "daily" in w and "precipitation_sum" in w["daily"] and len(w["daily"]["precipitation_sum"]) > 0:
                    rain_24h = round(float(w["daily"]["precipitation_sum"][0]), 1)
                else:
                    rain_24h = round(float(w["current"].get("precipitation", 0.0)) * 6.0, 1)
            else:
                # Fallback realistic baseline
                rain_24h = 85.0 if s["code"] in ["WB", "OD", "AS"] else 35.0
                status = "DELAYED"

            results.append({
                "id": s["id"],
                "name": s["name"],
                "pos": [s["lat"], s["lon"]],
                "rain24": rain_24h,
                "temp": temp,
                "status": status,
                "state": s["state"],
                "code": s["code"],
            })

        self._cache_set(cache_key, results)
        return results

    async def get_live_inundation_zones(self) -> List[Dict[str, Any]]:
        """Fetch live river discharge and compute basin risk zones"""
        cache_key = "inundation_zones"
        cached = self._cache_get(cache_key)
        if cached is not None:
            return cached

        tasks = [self.fetch_river_discharge(b["lat"], b["lon"]) for b in RIVER_BASINS]
        flood_data = await asyncio.gather(*tasks, return_exceptions=True)

        zones = []
        for b, f in zip(RIVER_BASINS, flood_data):
            discharge = 850.0  # m3/s baseline
            prob = 0.65
            if isinstance(f, dict) and "daily" in f and "river_discharge" in f["daily"]:
                discharges = [d for d in f["daily"]["river_discharge"] if d is not None]
                if discharges:
                    discharge = round(float(discharges[0]), 1)
                    # Discharge > 1200 m3/s indicates high/critical flood risk
                    prob = min(0.96, round(max(0.35, discharge / 2500.0 + 0.3), 2))

            level = "CRITICAL" if prob > 0.8 else "HIGH" if prob > 0.6 else "MODERATE" if prob > 0.35 else "LOW"
            area = round(65.0 + discharge * 0.08, 1)

            zones.append({
                "id": b["id"],
                "name": b["name"],
                "level": level,
                "prob": prob,
                "area": area,
                "coords": b["coords"],
                "river": b["river"],
                "discharge_m3s": discharge,
            })

        self._cache_set(cache_key, zones)
        return zones

weather_service = WeatherService()
