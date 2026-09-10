from datetime import datetime, timezone
from typing import List, Dict, Any

class AlertEngine:
    """Generates real-time actionable district alerts based on active rainfall & river discharge"""
    def generate_alerts(self, stations: List[Dict[str, Any]], zones: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        alerts = []
        alert_id = 1
        current_time_str = datetime.now(timezone.utc).strftime("%H:%M UTC")

        # 1. Basin flood alerts
        for z in zones:
            if z["prob"] >= 0.50:
                action = (
                    "Immediate evacuation of riverbank settlements, pre-position NDRF boats & pumps"
                    if z["level"] == "CRITICAL"
                    else "Alert district disaster management authorities, activate flood shelters"
                )
                alerts.append({
                    "id": f"a{alert_id}",
                    "level": z["level"],
                    "location": f"{z['name']} ({z.get('river', 'Basin')})",
                    "trigger": f"Discharge >{z.get('discharge_m3s', 850)} m³/s • Flood Probability {int(z['prob']*100)}%",
                    "prob": int(z["prob"] * 100),
                    "area": z["area"],
                    "time": current_time_str,
                    "action": action,
                    "status": "ACTIVE"
                })
                alert_id += 1

        # 2. Station heavy rainfall alerts
        for s in stations:
            if s["rain24"] >= 100.0:
                alerts.append({
                    "id": f"a{alert_id}",
                    "level": "WARNING" if s["rain24"] < 150 else "CRITICAL",
                    "location": f"{s['name']}, {s.get('state', '')}",
                    "trigger": f"24h Precipitation {s['rain24']} mm exceeds flood watch threshold",
                    "prob": min(95, int(s["rain24"] * 0.55)),
                    "area": round(s["rain24"] * 0.65, 1),
                    "time": current_time_str,
                    "action": "Issue municipal drainage clearance order and deploy mobile pumping units",
                    "status": "ACTIVE"
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
                "status": "ACTIVE"
            })

        return alerts

alert_engine = AlertEngine()
