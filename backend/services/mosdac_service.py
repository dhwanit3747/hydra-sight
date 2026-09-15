"""
HydroSense AI — MOSDAC / ISRO Satellite Weather & Hydrology Service
Meteorological & Oceanographic Satellite Data Archival Centre (ISRO/SAC)
Provides INSAT-3D / INSAT-3DR Rapid-Scan Half-Hourly Hydro-Estimator (HEM)
and Quantitative Precipitation Estimation (QPE).
"""

import os
import time
import httpx
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("hydrosense.mosdac")

MOSDAC_BASE_URL = "https://www.mosdac.gov.in"

class MosdacService:
    def __init__(self):
        self.user_email = os.getenv("MOSDAC_USER_EMAIL", "").strip()
        self.api_key = os.getenv("MOSDAC_API_KEY", "").strip()
        self._cache: Dict[str, Any] = {}
        self._cache_ttl = 600

    def is_configured(self) -> bool:
        return bool(self.user_email and self.api_key)

    async def get_satellite_telemetry_status(self) -> Dict[str, Any]:
        """
        Check connectivity to ISRO MOSDAC satellite meteorological portal.
        """
        cache_key = "mosdac_status"
        cached = self._cache.get(cache_key)
        if cached and (time.time() - cached["ts"]) < self._cache_ttl:
            return cached["data"]

        if not self.is_configured():
            res = {
                "status": "CONFIGURATION REQUIRED",
                "source": "ISRO MOSDAC (INSAT-3DR)",
                "satellite": "INSAT-3DR / 3D Imager",
                "product": "Hydro-Estimator Rainfall (HEM) & Convective Cloud Top",
                "required_vars": ["MOSDAC_USER_EMAIL", "MOSDAC_API_KEY"],
                "portal_url": "https://www.mosdac.gov.in/",
                "freshness": "configuration_required"
            }
            self._cache[cache_key] = {"data": res, "ts": time.time()}
            return res

        # Attempt connection to live MOSDAC service with credentials
        try:
            async with httpx.AsyncClient(timeout=6.0, verify=False) as client:
                resp = await client.get(f"{MOSDAC_BASE_URL}/api/v1/ping", headers={"X-MOSDAC-KEY": self.api_key})
                if resp.status_code == 200:
                    res = {
                        "status": "CONNECTED",
                        "source": "ISRO MOSDAC (INSAT-3DR)",
                        "satellite": "INSAT-3DR / 3D Imager",
                        "freshness": "live",
                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                    }
                    self._cache[cache_key] = {"data": res, "ts": time.time()}
                    return res
        except Exception as e:
            logger.warning(f"MOSDAC connectivity check failed: {e}")

        res = {
            "status": "OFFLINE",
            "source": "ISRO MOSDAC (INSAT-3DR)",
            "freshness": "unavailable"
        }
        self._cache[cache_key] = {"data": res, "ts": time.time()}
        return res

mosdac_service = MosdacService()
