NavRiti FastAPI backend

Quick start

1. Set environment variable `GOOGLE_API_KEY` in your shell if you want AI features.

2. Install deps:

```bash
pip install -r fastapi_server/requirements.txt
```

3. Run locally:

```bash
uvicorn fastapi_server.main:app --reload --host 0.0.0.0 --port 8000
```

4. Endpoints:
- GET /health
- POST /stage1  (accepts JSON matching Stage1Input)
- POST /stage2  (accepts JSON matching Stage2Input)
- POST /save_report (save report JSON)
