"""
stats.py
POST /api/visitors/ping   — called once on page load, increments counter
GET  /api/visitors/count  — returns total + today count
"""
import os
import json
from flask    import Blueprint, jsonify, request
from datetime import datetime, date

stats_bp = Blueprint("stats", __name__)

BASE_DIR      = os.path.dirname(os.path.dirname(__file__))
VISITORS_PATH = os.path.join(BASE_DIR, "data", "visitors.json")


def _read() -> dict:
    os.makedirs(os.path.dirname(VISITORS_PATH), exist_ok=True)
    if not os.path.exists(VISITORS_PATH):
        return {"total": 0, "today": 0, "today_date": "", "history": []}
    with open(VISITORS_PATH) as f:
        return json.load(f)


def _write(data: dict) -> None:
    with open(VISITORS_PATH, "w") as f:
        json.dump(data, f, indent=2)


@stats_bp.route("/visitors/ping", methods=["POST"])
def ping():
    data      = _read()
    today_str = str(date.today())

    # Reset daily count on new day
    if data.get("today_date") != today_str:
        data["today"]      = 0
        data["today_date"] = today_str

    data["total"] += 1
    data["today"] += 1

    # Append to history (anonymised — no raw IPs stored)
    data.setdefault("history", []).append({
        "timestamp": datetime.utcnow().isoformat(),
        "ip_hash":   hash(request.remote_addr) % 999_999,
    })
    data["history"] = data["history"][-1000:]
    _write(data)

    return jsonify({
        "success": True,
        "total":   data["total"],
        "today":   data["today"],
    }), 200


@stats_bp.route("/visitors/count", methods=["GET"])
def count():
    data      = _read()
    today_str = str(date.today())
    today     = data.get("today", 0) if data.get("today_date") == today_str else 0
    return jsonify({
        "success": True,
        "total":   data.get("total", 0),
        "today":   today,
    }), 200
