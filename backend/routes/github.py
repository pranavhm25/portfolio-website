"""
github.py
GET /api/github/projects  — latest 6 non-fork repos (cached 10 min)
GET /api/github/stats     — profile summary (repos, followers, etc.)
"""
import os
import time
import requests
from flask   import Blueprint, jsonify
from dotenv  import load_dotenv

load_dotenv()

github_bp = Blueprint("github", __name__)

_cache: dict  = {"data": None, "ts": 0}
CACHE_TTL     = 600   # seconds


def _headers() -> dict:
    h = {"Accept": "application/vnd.github+json"}
    token = os.getenv("GITHUB_TOKEN", "")
    if token:
        h["Authorization"] = f"Bearer {token}"
    return h


def _fetch_repos(username: str) -> list[dict]:
    resp = requests.get(
        f"https://api.github.com/users/{username}/repos",
        headers=_headers(),
        params={"per_page": 100, "sort": "updated", "direction": "desc"},
        timeout=8,
    )
    resp.raise_for_status()

    result = []
    for repo in resp.json():
        if repo.get("fork"):
            continue   # skip forks — show only original work

        # Fetch language breakdown
        languages = {}
        try:
            lr = requests.get(repo["languages_url"], headers=_headers(), timeout=5)
            if lr.ok:
                languages = lr.json()
        except Exception:
            pass

        result.append({
            "name":        repo["name"],
            "description": repo.get("description") or "No description provided.",
            "url":         repo["html_url"],
            "homepage":    repo.get("homepage") or "",
            "stars":       repo.get("stargazers_count", 0),
            "forks":       repo.get("forks_count", 0),
            "language":    repo.get("language") or "N/A",
            "languages":   languages,
            "updated_at":  repo.get("updated_at", ""),
            "topics":      repo.get("topics", []),
        })

        if len(result) >= 6:   # cap at 6
            break

    return result


@github_bp.route("/github/projects", methods=["GET"])
def github_projects():
    global _cache

    username = os.getenv("GITHUB_USERNAME", "")
    if not username:
        return jsonify({"success": False, "error": "GITHUB_USERNAME not set in .env"}), 500

    # Serve from cache if still fresh
    if _cache["data"] and (time.time() - _cache["ts"]) < CACHE_TTL:
        return jsonify({"success": True, "repos": _cache["data"], "cached": True}), 200

    try:
        repos  = _fetch_repos(username)
        _cache = {"data": repos, "ts": time.time()}
        return jsonify({"success": True, "repos": repos, "cached": False}), 200
    except requests.HTTPError as e:
        return jsonify({"success": False, "error": f"GitHub API error: {e}"}), 502
    except requests.Timeout:
        return jsonify({"success": False, "error": "GitHub API timed out."}), 504
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@github_bp.route("/github/stats", methods=["GET"])
def github_stats():
    username = os.getenv("GITHUB_USERNAME", "")
    if not username:
        return jsonify({"success": False, "error": "GITHUB_USERNAME not set"}), 500

    try:
        resp = requests.get(
            f"https://api.github.com/users/{username}",
            headers=_headers(), timeout=8,
        )
        resp.raise_for_status()
        u = resp.json()
        return jsonify({
            "success":      True,
            "username":     u["login"],
            "avatar_url":   u["avatar_url"],
            "public_repos": u["public_repos"],
            "followers":    u["followers"],
            "following":    u["following"],
            "profile_url":  u["html_url"],
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
