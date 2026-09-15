from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SystemStatus(BaseModel):
    operational: bool = True
    mode: str = "OPERATIONAL"
    timestamp: str
    active_scenario: str
    sources: List[Dict[str, Any]]

class KPIData(BaseModel):
    currentRainfall: Dict[str, Any]
    forecastRainfall: Dict[str, Any]
    floodProbability: Dict[str, Any]
    predictedInundation: Dict[str, Any]
    overallRisk: Dict[str, Any]

class StateRisk(BaseModel):
    code: str
    name: str
    center: List[float]
    rainfall: float
    risk: str
    prob: int
    hazard_score: Optional[float] = None
    exposure_score: Optional[float] = None
    vulnerability_score: Optional[float] = None

class StationReading(BaseModel):
    id: str
    name: str
    pos: List[float]
    rain24: float
    temp: float
    humidity: Optional[int] = None
    wind_speed: Optional[float] = None
    pressure: Optional[float] = None
    status: str
    state: Optional[str] = None
    code: Optional[str] = None
    source: Optional[str] = None
    freshness: Optional[str] = None
    timestamp: Optional[str] = None

class InundationZone(BaseModel):
    id: str
    name: str
    level: str
    prob: float
    area: float
    coords: List[List[float]]
    river: Optional[str] = None
    discharge_m3s: Optional[float] = None
    state: Optional[str] = None
    source: Optional[str] = None
    freshness: Optional[str] = None

class AlertItem(BaseModel):
    id: str
    level: str
    location: str
    trigger: str
    prob: int
    area: float
    time: str
    action: str
    status: str
    source: Optional[str] = "HydroSense AI"
    is_official_warning: Optional[bool] = False

class InundationRequest(BaseModel):
    rainfall: float = Field(default=150.0, ge=0.0, le=1000.0)
    duration: float = Field(default=12.0, ge=0.1, le=72.0)
    slope: float = Field(default=6.0, ge=0.0, le=90.0)
    soil: float = Field(default=65.0, ge=0.0, le=100.0)
    drainage: float = Field(default=45.0, ge=0.0, le=100.0)
    landCover: Optional[float] = Field(default=30.0, ge=0.0, le=100.0)

class InundationResponse(BaseModel):
    probability: float
    areaKm2: float
    risk: str
    zones: List[InundationZone]
    geojson: Optional[Dict[str, Any]] = None
    scale_factor: Optional[float] = None
    mode: str = "HYDROLOGICAL_SIMULATION"

class AIRainfallRequest(BaseModel):
    # Legacy short names
    temp: Optional[float] = None
    rh: Optional[float] = None
    pressure: Optional[float] = None
    wind_speed: Optional[float] = None
    antecedent_rain: Optional[float] = None
    soil_moisture: Optional[float] = None
    # Descriptive names sent by Rainfall.jsx
    temperature_c: Optional[float] = None
    humidity: Optional[float] = None
    pressure_hpa: Optional[float] = None
    rainfall_mm: Optional[float] = None
    max_station_rainfall: Optional[float] = None
    station_count: Optional[int] = None
    month: Optional[int] = None

class AIRainfallResponse(BaseModel):
    forecastMm: float
    heavyRainfallProbability: float
    confidence: float
    window: str = "24h"
    mode: str = "AI_METEOROLOGICAL_FUSION"
    drivers: List[str]
    inputs: Dict[str, Any]
