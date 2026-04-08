"""
Flask backend for the Note Visibility Report generator.
Serves a single-page UI and exposes an API endpoint to generate Excel reports.
"""
import io
import os
import re
import sys
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_file, send_from_directory

# Load .env from project root
PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

# Add tools/ to path so we can import the report module
sys.path.insert(0, str(PROJECT_ROOT / "tools"))
import note_visibility_report as nvr

app = Flask(__name__, static_folder="static")

# Regex to parse CaseWare document URLs
# e.g. https://ca.cwcloudpartner.com/ca-develop/e/eng/yK9KibLUQLOpAIEMo6XPXA/index.jsp#/efinancials/OfoGzA6HRqaeqdPVgSHg_w
CW_URL_PATTERN = re.compile(
    r"https?://([^/]+)/([^/]+)/e/eng/([^/]+)/[^#]*#/efinancials/([^/?\s]+)"
)


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True) or {}
    url = (data.get("url") or "").strip()

    if not url:
        return jsonify({"error": "URL is required."}), 400

    match = CW_URL_PATTERN.search(url)
    if not match:
        return jsonify({
            "error": "Invalid Caseware URL. Expected format: "
                     "https://<host>/<tenant>/e/eng/<engagementId>/...#/efinancials/<documentId>"
        }), 400

    host_name = match.group(1)
    tenant = match.group(2)
    engagement_id = match.group(3)
    document_id = match.group(4)
    template_name = (data.get("templateName") or "Report").strip()

    host = f"https://{host_name}"

    try:
        excel_bytes = nvr.generate_report_bytes(
            engagement_id=engagement_id,
            document_id=document_id,
            template_name=template_name,
            host=host,
            tenant=tenant,
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 422
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 502
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {e}"}), 500

    # Use the report name in the filename (sanitise for filesystem safety)
    safe_name = re.sub(r'[^\w\s-]', '', template_name).strip().replace(' ', '_')
    filename = f"{safe_name}_note_visibility.xlsx" if safe_name else f"note_visibility_{engagement_id[:8]}.xlsx"

    return send_file(
        io.BytesIO(excel_bytes),
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        as_attachment=True,
        download_name=filename,
    )


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", "1") == "1", port=5000)
