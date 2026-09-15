"""
HydroSense AI — Official India Meteorological Department (IMD) Integration Service
Integrates:
1. Official IMD GeoServer WFS endpoints (https://reactjs.imd.gov.in/geoserver/imd/wfs)
   - imd:district_warnings_india (764 districts official warnings)
   - imd:aws_data_layer (2,000+ Automated Weather Stations live data)
   - imd:radar_station_status (39 Doppler Weather Radar stations)
   - imd:subdiv_rainfall_now (36 meteorological subdivisions rainfall)
2. Official Authenticated IMD API Portal (https://api.imd.gov.in/api/v1/)
   - Authenticated via IMD_API_KEY (x-api-key) and IMD_JWT_TOKEN (Authorization: Bearer <token>)
   - Supports city forecasts, district rainfall, current weather
"""

import os
import time
import httpx
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("hydrosense.imd")

IMD_GEOSERVER_WFS = "https://reactjs.imd.gov.in/geoserver/imd/wfs"
IMD_API_BASE = "https://api.imd.gov.in/api/v1"

# Warning code interpretation according to IMD meteorological guidelines
IMD_WARNING_CODES = {
    "1": {"level": "NO_WARNING", "desc": "No Warning (Green)", "severity": "LOW"},
    "2": {"level": "WATCH", "desc": "Be Updated / Watch (Yellow)", "severity": "MODERATE"},
    "3": {"level": "ALERT", "desc": "Be Prepared / Alert (Orange)", "severity": "HIGH"},
    "4": {"level": "WARNING", "desc": "Take Action / Warning (Red)", "severity": "CRITICAL"},
}

class IMDService:
    def __init__(self):
        self.api_key = os.getenv("IMD_API_KEY", "").strip()
        self.jwt_token = os.getenv("IMD_JWT_TOKEN", "").strip()
        self._cache: Dict[str, Any] = {}
        self._cache_ttl = 300  # 5 minutes cache for weather bulletins

    def is_authenticated_configured(self) -> bool:
        return bool(self.api_key and self.jwt_token)

    def _cache_get(self, key: str) -> Optional[Any]:
        entry = self._cache.get(key)
        if entry and (time.time() - entry["ts"]) < self._cache_ttl:
            return entry["data"]
        return None

    def _cache_set(self, key: str, data: Any) -> None:
        self._cache[key] = {"data": data, "ts": time.time()}

    async def get_district_warnings(self, max_features: int = 50) -> Dict[str, Any]:
        """
        Fetch official IMD district-level warnings from GeoServer WFS.
        Returns GeoJSON FeatureCollection with live official warning metadata.
        """
        cache_key = f"imd_district_warnings_{max_features}"
        cached = self._cache_get(cache_key)
        if cached:
            return cached

        url = (
            f"{IMD_GEOSERVER_WFS}?service=WFS&version=1.0.0&request=GetFeature"
            f"&typeName=imd:district_warnings_india&outputFormat=application/json&maxFeatures={max_features}"
        )
        try:
            async with httpx.AsyncClient(timeout=10.0, verify=False) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    result = {
                        "status": "LIVE",
                        "source": "IMD Official GeoServer",
                        "totalFeatures": data.get("totalFeatures", len(data.get("features", []))),
                        "features": data.get("features", []),
                        "freshness": "live",
                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                    }
                    self._cache_set(cache_key, result)
                    return result
        except Exception as e:
            logger.warning(f"IMD GeoServer district warnings fetch error: {e}")

        # If cache exists even if expired, return as delayed
        entry = self._cache.get(cache_key)
        if entry:
            return {**entry["data"], "status": "DELAYED", "freshness": "stale"}

        return {
            "status": "OFFLINE",
            "source": "IMD Official GeoServer",
            "error": "IMD GeoServer endpoint unreachable or timed out",
            "features": [],
            "freshness": "unavailable"
        }

    async def get_aws_stations(self, max_features: int = 40) -> Dict[str, Any]:
        """
        Fetch live Automated Weather Station (AWS) telemetry from IMD GeoServer WFS.
        """
        cache_key = f"imd_aws_stations_{max_features}"
        cached = self._cache_get(cache_key)
        if cached:
            return cached

        url = (
            f"{IMD_GEOSERVER_WFS}?service=WFS&version=1.0.0&request=GetFeature"
            f"&typeName=imd:aws_data_layer&outputFormat=application/json&maxFeatures={max_features}"
        )
        try:
            async with httpx.AsyncClient(timeout=10.0, verify=False) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    result = {
                        "status": "LIVE",
                        "source": "IMD AWS Network",
                        "totalFeatures": data.get("totalFeatures", len(data.get("features", []))),
                        "features": data.get("features", []),
                        "freshness": "live",
                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                    }
                    self._cache_set(cache_key, result)
                    return result
        except Exception as e:
            logger.warning(f"IMD AWS stations fetch error: {e}")

        entry = self._cache.get(cache_key)
        if entry:
            return {**entry["data"], "status": "DELAYED", "freshness": "stale"}

        return {
            "status": "OFFLINE",
            "source": "IMD AWS Network",
            "features": [],
            "freshness": "unavailable"
        }

    async def get_radar_status(self) -> Dict[str, Any]:
        """
        Fetch Doppler Weather Radar (DWR) network status across India.
        """
        cache_key = "imd_radar_status"
        cached = self._cache_get(cache_key)
        if cached:
            return cached

        url = (
            f"{IMD_GEOSERVER_WFS}?service=WFS&version=1.0.0&request=GetFeature"
            f"&typeName=imd:radar_station_status&outputFormat=application/json&maxFeatures=50"
        )
        try:
            async with httpx.AsyncClient(timeout=10.0, verify=False) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    result = {
                        "status": "LIVE",
                        "source": "IMD Doppler Radar Network",
                        "total": len(data.get("features", [])),
                        "features": data.get("features", []),
                        "freshness": "live",
                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                    }
                    self._cache_set(cache_key, result)
                    return result
        except Exception as e:
            logger.warning(f"IMD Radar status fetch error: {e}")

        entry = self._cache.get(cache_key)
        if entry:
            return {**entry["data"], "status": "DELAYED", "freshness": "stale"}

        return {
            "status": "OFFLINE",
            "source": "IMD Doppler Radar Network",
            "features": [],
            "freshness": "unavailable"
        }

    async def fetch_authenticated_api(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Query official authenticated API portal (https://api.imd.gov.in/api/v1/...)
        Uses x-api-key and Authorization: Bearer <jwt_token>.
        """
        if not self.is_authenticated_configured():
            return {
                "status": "CONFIGURATION REQUIRED",
                "message": "IMD API credentials missing. Set IMD_API_KEY and IMD_JWT_TOKEN in backend/.env to activate official portal endpoints.",
                "portal_url": "https://api.imd.gov.in/public/login.php"
            }

        url = f"{IMD_API_BASE}/{endpoint.lstrip('/')}"
        headers = {
            "x-api-key": self.api_key,
            "Authorization": f"Bearer {self.jwt_token}",
            "Accept": "application/json"
        }
        try:
            async with httpx.AsyncClient(timeout=8.0, verify=False) as client:
                resp = await client.get(url, headers=headers, params=params)
                if resp.status_code == 200:
                    return {"status": "LIVE", "data": resp.json(), "freshness": "live"}
                elif resp.status_code == 401:
                    return {"status": "UNAUTHORIZED", "error": resp.text, "portal_url": "https://api.imd.gov.in/public/login.php"}
                else:
                    return {"status": "ERROR", "code": resp.status_code, "error": resp.text}
        except Exception as e:
            return {"status": "OFFLINE", "error": str(e)}

imd_service = IMDService()
