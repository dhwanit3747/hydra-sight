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

class StationReading(BaseModel):
    id: str
    name: str
    pos: List[float]
    rain24: float
    temp: float
    status: str

class InundationZone(BaseModel):
    id: str
    name: str
    level: str
    prob: float
    area: float
    coords: List[List[float]]
    river: Optional[str] = None
    discharge_m3s: Optional[float] = None

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
    mode: str = "LIVE_CALCULATION"
