# Contact Manager Monorepo

This repository contains the contact-management web app and its AI agent:

| Directory | Service | Technology |
| --- | --- | --- |
| `contact-manager/` | Web app, contacts API, and PostgreSQL access | Next.js, TypeScript |
| `agent-service/` | Natural-language contact assistant | FastAPI, LangGraph, Gemini |

The Next.js app proxies `/agent-api/*` requests to the agent service. In
Railway, deploy both directories as services in the same project, give a public
domain only to `contact-manager`, and keep `agent-service` private. Users then
use one link for the UI and assistant.

## Run locally

1. Configure `contact-manager/.env.local` with a PostgreSQL connection string:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/contact_manager?sslmode=disable
   AGENT_SERVICE_URL=http://localhost:8000
   ```

2. Start the web app:

   ```powershell
   cd contact-manager
   npm ci
   npm run dev
   ```

3. In another terminal, configure `agent-service/.env` with `GEMINI_API_KEY`
   and `CONTACT_API_BASE_URL=http://localhost:3000`, install its dependencies,
   then start it:

   ```powershell
   cd agent-service
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   Copy-Item .env.example .env
   # Set GEMINI_API_KEY in .env before starting the service.
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   Open `http://localhost:3000`. The app's `/agent-api/chat` route forwards
   assistant requests to the local agent service.

## Deploy both services to Railway

1. Push this monorepo to the new GitHub repository and create a Railway project
   from it.
2. Add two services from that same repository:
   - `contact-manager`, with **Root Directory** set to `/contact-manager`.
   - `agent-service`, with **Root Directory** set to `/agent-service`.

   Each directory contains its own `railway.json` with the build/start commands
   and health check. Railway can use the Nixpacks builder for both.
3. Add a Railway PostgreSQL database to the project. Set the web service's
   `DATABASE_URL` to the database's `DATABASE_URL` reference, for example
   `${{Postgres.DATABASE_URL}}` (use the actual database service name).
4. Configure these service variables. The service names in the references must
   match the names you gave the Railway services:

   **`contact-manager`:**

   ```env
   AGENT_SERVICE_URL=http://${{agent-service.RAILWAY_PRIVATE_DOMAIN}}:${{agent-service.PORT}}
   ```

   **`agent-service`:**

   ```env
   GEMINI_API_KEY=<your Gemini API key>
   CONTACT_API_BASE_URL=http://${{contact-manager.RAILWAY_PRIVATE_DOMAIN}}:${{contact-manager.PORT}}
   ```

5. Generate a public domain for `contact-manager` only. Do not generate one for
   `agent-service`; the agent is reached through the web app's same-origin
   `/agent-api/` proxy. Visit the `contact-manager` domain for the entire app.

Railway service variables and the `PORT` value are resolved by Railway at
deploy time. Keep secrets such as `GEMINI_API_KEY` and `DATABASE_URL` in Railway
variables, not in the repository.
