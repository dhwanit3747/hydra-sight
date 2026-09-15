"""
HydroSense AI — Operational Alerts Engine
Differentiates between:
1. Official Government Weather Warnings (IMD Official Warning)
2. Local Hydrodynamic Machine Learning Predictions (HydroSense AI Prediction)

Never presents model predictions as government warnings.
"""

from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

class AlertEngine:
    def generate_alerts(
        self,
        stations: List[Dict[str, Any]],
        zones: List[Dict[str, Any]],
        imd_warnings: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        alerts = []
        alert_id = 1
        current_time_str = datetime.now(timezone.utc).strftime("%H:%M UTC")

        # 1. Integrate Official IMD Government Warnings if available
        if imd_warnings and imd_warnings.get("status") in ["LIVE", "DELAYED"]:
            features = imd_warnings.get("features", [])
            for feat in features[:4]:  # Top active district warnings
                props = feat.get("properties", {})
                district = props.get("District") or props.get("district")
                day1_code = str(props.get("Day_1", "1"))
                date_str = props.get("Date", "Today")

                if district and day1_code in ["2", "3", "4"]:
                    level_map = {
                        "4": ("CRITICAL", "IMD Red Alert: Extreme weather / heavy rainfall warning. Immediate disaster mitigation required."),
                        "3": ("WARNING", "IMD Orange Alert: Be prepared for localized heavy rainfall, waterlogging and river swell."),
                        "2": ("WATCH", "IMD Yellow Alert: Weather watch active. Keep updated on river basin bulletins.")
                    }
                    lvl, act = level_map.get(day1_code, ("WATCH", "Maintain standard monitoring."))

                    alerts.append({
                        "id": f"a{alert_id}",
                        "level": lvl,
                        "location": f"{district} District (IMD Official)",
                        "trigger": f"Official IMD Warning Code {day1_code} • Issued {date_str}",
                        "prob": 92 if lvl == "CRITICAL" else 75 if lvl == "WARNING" else 55,
                        "area": 120.0 if lvl == "CRITICAL" else 85.0,
                        "time": current_time_str,
                        "action": act,
                        "status": "ACTIVE",
                        "source": "IMD Official Warning",
                        "is_official_warning": True
                    })
                    alert_id += 1

        # 2. HydroSense AI Hydrological Basin Flood Risk Predictions
        for z in zones:
            if z.get("prob", 0) >= 0.50:
                action = (
                    "Immediate evacuation of riverbank lowlands, pre-position NDRF boats & de-watering pumps"
                    if z.get("level") == "CRITICAL"
                    else "Alert district disaster management authorities, activate flood shelters"
                )
                alerts.append({
                    "id": f"a{alert_id}",
                    "level": z.get("level", "WARNING"),
                    "location": f"{z.get('name')} ({z.get('river', 'Basin')})",
                    "trigger": f"Discharge {z.get('discharge_m3s', 850)} m³/s • HydroSense AI Prob {int(z.get('prob', 0.6)*100)}%",
                    "prob": int(z.get("prob", 0.6) * 100),
                    "area": z.get("area", 65.0),
                    "time": current_time_str,
                    "action": action,
                    "status": "ACTIVE",
                    "source": "HydroSense AI Prediction",
                    "is_official_warning": False
                })
                alert_id += 1

        # 3. Weather Station Heavy Precipitation Triggers
        for s in stations:
            if s.get("rain24", 0) >= 100.0:
                alerts.append({
                    "id": f"a{alert_id}",
                    "level": "WARNING" if s.get("rain24", 0) < 150 else "CRITICAL",
                    "location": f"{s.get('name')}, {s.get('state', '')}",
                    "trigger": f"24h Precipitation {s.get('rain24')} mm exceeds flood watch threshold",
                    "prob": min(95, int(s.get("rain24", 0) * 0.55)),
                    "area": round(s.get("rain24", 0) * 0.65, 1),
                    "time": current_time_str,
                    "action": "Issue municipal drainage clearance order and deploy mobile pumping units",
                    "status": "ACTIVE",
                    "source": "HydroSense AI Telemetry Alert",
                    "is_official_warning": False
                })
                alert_id += 1

        if not alerts:
            alerts.append({
                "id": "a1",
                "level": "INFORMATION",
                "location": "National Hydrological Network",
                "trigger": "All monitoring stations operating within normal threshold limits",
                "prob": 15,
                "area": 0.0,
                "time": current_time_str,
                "action": "Maintain standard 6-hour radar and telemetry monitoring cycle",
                "status": "ACTIVE",
                "source": "HydroSense AI System Status",
                "is_official_warning": False
            })

        return alerts

alert_engine = AlertEngine()
