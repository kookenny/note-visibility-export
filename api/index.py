"""Vercel serverless entrypoint — re-exports the Flask app from web/app.py."""
import sys
from pathlib import Path

# Ensure project root is on the path so `web.app` and `tools.*` are importable
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(PROJECT_ROOT / "tools"))

from web.app import app  # noqa: E402,F401 — Vercel looks for `app`
