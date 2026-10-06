# Contact Manager

A full-stack contact management app. Add, edit, delete, and browse contacts,
all persisted in a real PostgreSQL database.

## What it does

- Add a contact with a name and phone number
- View all saved contacts in a list (table on desktop, cards on mobile)
- Edit a contact's name or phone number in place
- Delete a contact, with a confirmation dialog
- All data is stored in PostgreSQL and survives page refreshes, browser
  restarts, and new sessions — nothing is kept only in React state or
  localStorage

## Technology used

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** throughout
- **Tailwind CSS 4** for styling
- **PostgreSQL** for persistence, accessed with the [`pg`](https://node-postgres.com/)
  driver (no ORM) via server-side API routes
- Deployed on Railway alongside the private AI agent service

## Project structure

```
app/
  page.tsx                 # Main page: header + <ContactManager />
  layout.tsx                # Root layout
  globals.css                # Tailwind + theme tokens
  api/
    contacts/
      route.ts              # GET (list), POST (create)
      [id]/route.ts          # PUT/PATCH (update), DELETE

components/
  ContactManager.tsx         # Client component: owns state, wires everything together
  ContactForm.tsx            # "Add contact" form
  ContactList.tsx             # Table (desktop) / card list (mobile)
  ContactItem.tsx              # One row/card, switches to EditContactForm when editing
  EditContactForm.tsx           # Inline edit form (Save / Cancel)
  DeleteConfirmation.tsx         # Accessible confirmation dialog
  Toast.tsx                       # Success/error toast notifications

lib/
  db.ts                       # PostgreSQL connection pool + schema bootstrap
  contacts.ts                  # Data access functions (list/get/create/update/delete)
  validation.ts                  # Shared client + server validation

types/
  contact.ts                    # Shared TypeScript types

.env.example                    # Required environment variable names (no secrets)
```

## 1. Install dependencies

```bash
npm install
```

## 2. Set up the database

You need a PostgreSQL database. The app will automatically create its
`contacts` table (and required `pgcrypto` extension) the first time it
connects — there's no separate migration step to run.

**Option A — local Postgres**

```bash
createdb contact_manager
```

**Option B — hosted Postgres**

Any Postgres-compatible provider works. Good free options:
- [Railway Postgres](https://docs.railway.com/guides/postgresql) — provisioned in the Railway project
- [Neon](https://neon.tech) — serverless Postgres
- [Supabase](https://supabase.com)

Create a database/project with any of these and copy the connection string
they give you.

## 3. Configure environment variables

Copy the example file and fill in your connection string:

```bash
cp .env.example .env.local
```

```
DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require
```

(For a local database without SSL, add `?sslmode=disable` instead, e.g.
`postgresql://postgres:postgres@localhost:5432/contact_manager?sslmode=disable`.)

`lib/db.ts` also accepts `POSTGRES_URL` as an alternative name, since that's
what some providers set automatically. Set `AGENT_SERVICE_URL` to
`http://localhost:8000` for local development; the Next.js rewrite proxies
assistant requests through `/agent-api/`.

## 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000.

## 5. Build for production

```bash
npm run build
npm run start
```

## Monorepo and Railway deployment

This app is the public-facing Railway service. Set its Railway **Root
Directory** to `/contact-manager`; the included `railway.json` defines its
build, start command, and `/api/health` check. Set `DATABASE_URL` to the
Railway PostgreSQL connection string and `AGENT_SERVICE_URL` to the private
agent service URL. Detailed two-service setup and variable references are in
the [monorepo deployment guide](../README.md#deploy-both-services-to-railway).

## Notes

- Validation (required name, required + format-checked phone) runs both in
  the browser and again on the server — the server never trusts client input.
- Database credentials are only ever read on the server (`lib/db.ts`, used by
  API routes); nothing is exposed to the browser.
- Errors are caught and translated into user-friendly messages; raw database
  errors are logged server-side but never shown to the user.
