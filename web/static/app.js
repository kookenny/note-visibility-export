// Caseware URL pattern:
// https://<host>/<tenant>/e/eng/<engagementId>/index.jsp#/efinancials/<documentId>
// (Caseware Cloud URL format)
const CW_URL_PATTERN = /https?:\/\/([^/]+)\/([^/]+)\/e\/eng\/([^/]+)\/[^#]*#\/efinancials\/([^/?\s]+)/;

const urlInput = document.getElementById('cwUrl');
const parsedInfo = document.getElementById('parsedInfo');
const generateBtn = document.getElementById('generateBtn');
const statusEl = document.getElementById('status');
const errorEl = document.getElementById('error');
const successEl = document.getElementById('success');

// Live URL parsing feedback
urlInput.addEventListener('input', function () {
    const match = this.value.trim().match(CW_URL_PATTERN);
    if (match) {
        parsedInfo.textContent =
            'Tenant: ' + match[2] +
            '  |  Engagement: ' + match[3].slice(0, 12) + '\u2026' +
            '  |  Document: ' + match[4].slice(0, 12) + '\u2026';
        parsedInfo.classList.add('parsed-success');
        urlInput.classList.remove('input-error');
    } else if (this.value.trim()) {
        parsedInfo.textContent = 'URL not recognized \u2014 expected a Caseware document URL';
        parsedInfo.classList.remove('parsed-success');
    } else {
        parsedInfo.textContent = 'Paste a Caseware document URL to auto-extract IDs';
        parsedInfo.classList.remove('parsed-success');
    }
});

// Generate report
generateBtn.addEventListener('click', async function () {
    clearMessages();

    const url = urlInput.value.trim();
    if (!url) {
        showError('Please paste a Caseware document URL.');
        urlInput.classList.add('input-error');
        urlInput.focus();
        return;
    }

    const match = url.match(CW_URL_PATTERN);
    if (!match) {
        showError('Invalid URL format. Expected a Caseware document URL (https://<host>/<tenant>/e/eng/<id>/...#/efinancials/<id>)');
        urlInput.classList.add('input-error');
        urlInput.focus();
        return;
    }

    const templateName = document.getElementById('templateName').value.trim();

    setLoading(true);

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, templateName: templateName || 'Report' }),
        });

        if (!response.ok) {
            let errMsg = 'An error occurred while generating the report.';
            try {
                const err = await response.json();
                errMsg = err.error || errMsg;
            } catch (_) { /* response wasn't JSON */ }
            throw new Error(errMsg);
        }

        // Download the file
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;

        // Extract filename from Content-Disposition or use default
        const disposition = response.headers.get('Content-Disposition');
        const filenameMatch = disposition && disposition.match(/filename="?([^"]+)"?/);
        a.download = filenameMatch ? filenameMatch[1] : 'note_visibility_report.xlsx';

        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);

        showSuccess('Report downloaded successfully.');
    } catch (e) {
        showError(e.message);
    } finally {
        setLoading(false);
    }
});

// Allow Enter key to submit
urlInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') generateBtn.click();
});

function setLoading(loading) {
    generateBtn.disabled = loading;
    statusEl.hidden = !loading;
}

function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
}

function showSuccess(msg) {
    successEl.textContent = msg;
    successEl.hidden = false;
}

function clearMessages() {
    errorEl.hidden = true;
    successEl.hidden = true;
    urlInput.classList.remove('input-error');
}
