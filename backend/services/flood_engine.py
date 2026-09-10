import numpy as np
from sklearn.ensemble import RandomForestRegressor
from typing import Dict, Any

class FloodEngine:
    """Hydrological & ML flood risk estimator based on terrain, soil & precipitation"""
    def __init__(self):
        self._init_model()

    def _init_model(self):
        # Synthetic physics-informed training dataset for flood probability prediction:
        # Features: [Rainfall (mm), Duration (h), Terrain Slope (deg), Soil Saturation (%), Drainage Cap (%), Land Cover (%)]
        np.random.seed(42)
        n_samples = 1200
        
        rain = np.random.uniform(10, 350, n_samples)
        dur = np.random.uniform(1, 48, n_samples)
        slope = np.random.uniform(0.5, 30, n_samples)
        soil = np.random.uniform(10, 100, n_samples)
        drain = np.random.uniform(10, 100, n_samples)
        land = np.random.uniform(5, 90, n_samples)

        # Intensity = rain / duration
        intensity = rain / dur
        # Hydrological runoff & flood probability formula:
        # High rainfall + high intensity + saturated soil + impervious land - good slope - high drainage
        score = (
            (rain * 0.0035) + 
            (intensity * 0.022) + 
            (soil * 0.004) + 
            (land * 0.002) - 
            (slope * 0.012) - 
            (drain * 0.0035)
        )
        # Normalize between 0.05 and 0.98
        prob = 1.0 / (1.0 + np.exp(-3.5 * (score - 0.75)))
        prob = np.clip(prob, 0.05, 0.98)

        X = np.column_stack([rain, dur, slope, soil, drain, land])
        y = prob

        self.model = RandomForestRegressor(n_estimators=45, random_state=42)
        self.model.fit(X, y)

    def predict(self, rainfall: float, duration: float, slope: float, soil: float, drainage: float, land_cover: float = 30.0) -> Dict[str, Any]:
        features = np.array([[rainfall, duration, slope, soil, drainage, land_cover]])
        prob = float(self.model.predict(features)[0])
        prob = max(0.05, min(0.98, prob))

        # Dynamic area calculation (km2)
        area = round(float(40.0 + (rainfall * 1.5) + (soil * 0.7) - (drainage * 0.4) - (slope * 1.8)), 1)
        area = max(15.0, area)

        risk = "CRITICAL" if prob > 0.80 else "HIGH" if prob > 0.55 else "MODERATE" if prob > 0.25 else "LOW"

        return {
            "probability": round(prob, 2),
            "areaKm2": area,
            "risk": risk
        }

flood_engine = FloodEngine()
