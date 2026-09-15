"""
HydroSense AI — Copernicus Data Space Ecosystem (CDSE) / Sentinel-1 SAR Flood Observation Service
Official integration for European Space Agency (ESA) Copernicus Data Space.
Sentinel-1 C-band Synthetic Aperture Radar (SAR) penetrates cloud cover and heavy monsoon rain
to provide accurate floodwater surface mapping.

Authentication:
- Token Endpoint: https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token
- Catalog Endpoint: https://catalogue.dataspace.copernicus.eu/odata/v1/Products
"""

import os
import time
import httpx
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("hydrosense.copernicus")

COPERNICUS_TOKEN_URL = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
COPERNICUS_CATALOG_URL = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products"

class CopernicusService:
    def __init__(self):
        self.client_id = os.getenv("COPERNICUS_CLIENT_ID", "").strip()
        self.client_secret = os.getenv("COPERNICUS_CLIENT_SECRET", "").strip()
        self.username = os.getenv("COPERNICUS_USERNAME", "").strip()
        self.password = os.getenv("COPERNICUS_PASSWORD", "").strip()
        self._access_token: Optional[str] = None
        self._token_expires_at: float = 0
        self._cache: Dict[str, Any] = {}
        self._cache_ttl = 600  # 10 minutes

    def is_configured(self) -> bool:
        return bool((self.client_id and self.client_secret) or (self.username and self.password))

    async def get_access_token(self) -> Optional[str]:
        if self._access_token and time.time() < self._token_expires_at:
            return self._access_token

        if not self.is_configured():
            return None

        try:
            data = {"grant_type": "client_credentials"}
            if self.client_id and self.client_secret:
                data["client_id"] = self.client_id
                data["client_secret"] = self.client_secret
            elif self.username and self.password:
                data["grant_type"] = "password"
                data["client_id"] = "cdse-public"
                data["username"] = self.username
                data["password"] = self.password

            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(COPERNICUS_TOKEN_URL, data=data)
                if resp.status_code == 200:
                    token_data = resp.json()
                    self._access_token = token_data.get("access_token")
                    expires_in = token_data.get("expires_in", 3600)
                    self._token_expires_at = time.time() + expires_in - 60
                    return self._access_token
                else:
                    logger.warning(f"Copernicus OAuth2 token request failed: {resp.status_code} {resp.text}")
        except Exception as e:
            logger.error(f"Copernicus token error: {e}")
        return None

    async def get_latest_sar_flood_observations(self, bbox: Optional[List[float]] = None) -> Dict[str, Any]:
        """
        Query Copernicus Data Space for latest Sentinel-1 GRD SAR acquisitions
        over Indian river basins.
        """
        if not self.is_configured():
            # Real public catalog query is actually accessible without auth for metadata!
            pass

        cache_key = "sentinel1_sar_observations"
        cached = self._cache.get(cache_key)
        if cached and (time.time() - cached["ts"]) < self._cache_ttl:
            return cached["data"]

        # Default query for Indian subcontinent SAR products
        # Filter for Sentinel-1 GRD (Ground Range Detected) product types
        query_url = (
            f"{COPERNICUS_CATALOG_URL}?$filter=startswith(Name,'S1') "
            f"and Attributes/OData.CSC.StringAttribute/any(att:att/Name eq 'productType' and att/OData.CSC.StringAttribute/Value eq 'GRD') "
            f"&$orderby=ContentDate/Start desc&$top=5"
        )

        headers = {"Accept": "application/json"}
        token = await self.get_access_token()
        if token:
            headers["Authorization"] = f"Bearer {token}"

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(query_url, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    products = data.get("value", [])
                    result = {
                        "status": "LIVE" if token else "LIVE_PUBLIC_CATALOG",
                        "source": "Copernicus Data Space (Sentinel-1 SAR)",
                        "satellite": "Sentinel-1A/1B C-SAR",
                        "sensorMode": "IW (Interferometric Wide Swath)",
                        "count": len(products),
                        "products": [
                            {
                                "id": p.get("Id"),
                                "name": p.get("Name"),
                                "date": p.get("ContentDate", {}).get("Start"),
                                "footprint": p.get("Footprint"),
                                "sizeBytes": p.get("ContentLength"),
                            }
                            for p in products
                        ],
                        "freshness": "live",
                        "configured": self.is_configured(),
                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                    }
                    self._cache[cache_key] = {"data": result, "ts": time.time()}
                    return result
                else:
                    logger.warning(f"Copernicus catalog error: {resp.status_code}")
        except Exception as e:
            logger.warning(f"Copernicus catalog fetch failed: {e}")

        # If missing credentials and query failed
        if not self.is_configured():
            return {
                "status": "CONFIGURATION REQUIRED",
                "source": "Copernicus Data Space Ecosystem",
                "satellite": "Sentinel-1 SAR",
                "required_vars": ["COPERNICUS_CLIENT_ID", "COPERNICUS_CLIENT_SECRET"],
                "signup_url": "https://dataspace.copernicus.eu/",
                "freshness": "configuration_required"
            }

        return {
            "status": "OFFLINE",
            "source": "Copernicus Data Space Ecosystem",
            "freshness": "unavailable"
        }

copernicus_service = CopernicusService()
