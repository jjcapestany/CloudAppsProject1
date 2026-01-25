# CloudAppsProject1

Flask + React + MongoDB

## Prerequisites

| Tool | Linux | macOS | Windows |
|------|-------|-------|---------|
| uv | `curl -LsSf https://astral.sh/uv/install.sh \| sh` | `brew install uv` | `powershell -c "irm https://astral.sh/uv/install.ps1 \| iex"` |
| Docker | [Docker Engine](https://docs.docker.com/engine/install/) | `brew install --cask docker` | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |
| Node.js | `sudo apt install nodejs npm` | `brew install node` | [nodejs.org](https://nodejs.org/) |

## Quick Start

### 1. Clone and install dependencies
```bash
git clone <repo-url>
cd CloudAppsProject1
uv sync
cd frontend && npm install && cd ..
```

### 2. Set up environment

**Linux/macOS:**
```bash
cp .env.example .env
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

### 3. Start MongoDB

**Linux/macOS:**
```bash
docker compose up -d
```

**Windows:**
```powershell
docker compose up -d
```

> On Windows, ensure Docker Desktop is running first.

### 4. Run the backend
```bash
uv run flask run
```

### 5. Run the frontend (separate terminal)
```bash
cd frontend
npm run dev
```

## Example Flow

Here's what a typical dev session looks like:
```bash
# Terminal 1 — Start MongoDB
$ docker compose up -d
[+] Running 1/1
 ✔ Container cloudappsproject1-mongo-1  Started

# Terminal 2 — Start Flask backend
$ uv run flask run
 * Debug mode: on
 * Running on http://127.0.0.1:5000

# Terminal 3 — Start React frontend
$ cd frontend
$ npm run dev
  VITE v5.x.x  ready in 500 ms
  ➜  Local:   http://127.0.0.1:5173/

# Test the API
$ curl http://127.0.0.1:5000/api/health
{"status": "ok"}

# Write to database
$ curl -X POST http://127.0.0.1:5000/api/test \
    -H "Content-Type: application/json" \
    -d '{"message": "hello"}'
{"inserted_id": "..."}

# Read from database
$ curl http://127.0.0.1:5000/api/test
[{"message": "hello"}]
```

Open http://127.0.0.1:5173 in your browser to see the React app.

## Access

| Service  | URL                     |
|----------|-------------------------|
| Backend  | http://127.0.0.1:5000   |
| Frontend | http://127.0.0.1:5173   |

> ⚠️ Use `127.0.0.1` instead of `localhost` — some network configs (Tailscale, VPNs) cause DNS issues.

## Project Structure
```
├── app.py              # Flask entry point
├── api/
│   ├── __init__.py     # create_app() factory
│   └── routes.py       # API endpoints
├── frontend/           # React (Vite)
├── docker-compose.yml  # MongoDB
├── pyproject.toml      # Python dependencies
└── .env.example        # Environment template
```

## API Endpoints

| Method | Endpoint      | Description       |
|--------|---------------|-------------------|
| GET    | /api/health   | Health check      |
| GET    | /api/test     | Read test items   |
| POST   | /api/test     | Write test item   |

## Useful Commands

| Action | Command |
|--------|---------|
| Start MongoDB | `docker compose up -d` |
| Stop MongoDB | `docker compose down` |
| Run backend | `uv run flask run` |
| Run frontend | `cd frontend && npm run dev` |
| Add Python package | `uv add <package>` |
| Add npm package | `cd frontend && npm install <package>` |

## Troubleshooting

### `localhost` not working
Use `127.0.0.1` instead. VPNs and tools like Tailscale can hijack localhost DNS.

### `.env` not loading
Ensure `python-dotenv` is installed:
```bash
uv add python-dotenv
```

### MongoDB connection refused
Check Docker is running:
```bash
docker ps
```

### Windows: `uv` not recognized
Restart your terminal after installing uv, or add it to PATH manually.