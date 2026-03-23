"""
resume.py
GET /api/resume/download  — serve resume.pdf + increment counter
GET /api/resume/count     — return total download count
"""
import os
import json
from flask      import Blueprint, send_file, jsonify, abort
from datetime   import datetime

resume_bp = Blueprint("resume", __name__)

BASE_DIR      = os.path.dirname(os.path.dirname(__file__))
RESUME_PATH   = os.path.join(BASE_DIR, "static", "resume.pdf")
COUNTER_PATH  = os.path.join(BASE_DIR, "data",   "resume_counter.json")


def _read() -> dict:
    os.makedirs(os.path.dirname(COUNTER_PATH), exist_ok=True)
    if not os.path.exists(COUNTER_PATH):
        return {"total": 0, "history": []}
    with open(COUNTER_PATH) as f:
        return json.load(f)


def _write(data: dict) -> None:
    with open(COUNTER_PATH, "w") as f:
        json.dump(data, f, indent=2)


@resume_bp.route("/resume/download", methods=["GET"])
def download_resume():
    if not os.path.exists(RESUME_PATH):
        abort(404, description="resume.pdf not found. Add it to backend/static/resume.pdf")

    # Increment counter
    data = _read()
    data["total"] += 1
    data.setdefault("history", []).append({
        "timestamp": datetime.utcnow().isoformat(),
        "count":     data["total"],
    })
    data["history"] = data["history"][-500:]   # keep last 500 entries
    _write(data)

    return send_file(
        RESUME_PATH,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="Pranav_Resume.pdf",
    )


@resume_bp.route("/resume/count", methods=["GET"])
def get_count():
    data = _read()
    return jsonify({"success": True, "total_downloads": data.get("total", 0)}), 200
