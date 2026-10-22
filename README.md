# Campus Copilot

Campus Copilot is a responsive campus information assistant for students and faculty. It brings schedules, notices, library resources, faculty contacts, services, and feedback into one web app. Fictional sample data and a replaceable mock AI service make the project usable without a backend.

> This repository is a PBL project foundation. Demo authentication and sample content are for demonstration only and are not production identity or campus records.

## Features

- Student dashboard, timetable, notices and notice details, library catalogue, faculty directory, campus services, feedback, profile, and settings.
- Campus Copilot chat with mock intent handling, source labels, suggested questions, copy, feedback, and loading states.
- Login, registration, password reset, protected routes, and an admin interface ready for server-managed roles.
- Light, dark, and system appearance modes; responsive desktop, tablet, and mobile navigation.
- Installable Progressive Web App with a web manifest, offline app shell, and connection status notice.
- Supabase-ready authentication/data integration and a separated AI service interface.

## Technology

React 19, TypeScript, Vite, Tailwind CSS 4, React Router, TanStack Query, React Hook Form, Zod, Lucide React, Supabase JS, Drizzle ORM, and PostgreSQL.

## Requirements

- Node.js 22.12 or later
- npm
- Optional: a Supabase project for hosted authentication and feedback persistence
- Optional: Supabase CLI for applying migrations with `supabase db push`

## Start the project

Install dependencies and create your local environment file:

```bash
npm install
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. Without Supabase credentials, the app runs in browser-local demo mode. Demo sign-in accepts any valid email address and a password of at least 6 characters; registration saves a demo session in the current browser. Demo sessions do not authenticate a real user and should not be used for sensitive information.

To create and locally preview a production build:

```bash
npm run build
npm run preview
```

The service worker is enabled in production builds and on secure origins (HTTPS or localhost). Install prompts depend on browser and platform support. Development mode intentionally does not register a service worker, which keeps hot reload predictable.

## Email and account format

Enter an email address in standard `name@domain` format. The forms suggest addresses at `silveroak.edu`, but currently do not restrict sign-ups to that domain. Registration asks for a full name, email, and password with at least 8 characters (enforced by the browser form). Demo sign-in requires at least 6 password characters. With Supabase configured, Supabase Auth handles account creation and applies the project's password and email-confirmation settings. Registration supplies `full_name` and `role: student` as user metadata; client-supplied metadata must not be trusted for authorization.

## Environment variables and Supabase

Copy `.env.example` to `.env`. For real Supabase authentication, replace the example values with the project URL and public anon/publishable key from your Supabase project settings.

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL used by the browser client |
| `VITE_SUPABASE_ANON_KEY` | Public Supabase anon/publishable key; protect database access with row-level security policies |
| `DATABASE_URL` | PostgreSQL connection string for server-side Drizzle Kit migrations & seeding; never expose with a `VITE_` prefix |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional service role secret for server-side administrative tasks and Auth user seeding; never expose to frontend |
| `VITE_API_BASE_URL` | Optional future REST API base URL |
| `VITE_AI_API_URL` | Optional future server-side AI endpoint; do not put provider keys here |

Keep `.env` private. Never put a database password, Supabase service-role key, or AI provider secret in a `VITE_` variable; Vite variables are embedded in browser code. When Supabase credentials are absent, login and registration use a browser-local demo session. Production admin roles must be assigned using trusted server-side processes and enforced by database/API policies. Frontend route protection is navigation only, not authorization.

## Database setup and migrations

The Drizzle schema is in `src/db/schema.ts`. `drizzle.config.ts` points Drizzle Kit at that schema and writes generated migrations to `supabase/migrations`. The checked-in SQL migrations create `users`, `notices`, and `feedback`, then add a priority column to feedback.

1. Create or select a Supabase project.
2. Set `DATABASE_URL` in `.env` to the PostgreSQL connection string from the Supabase dashboard's **Project Settings > Database**. Use a direct connection or the appropriate session pooler for migration tooling; do not expose this value to the browser.
3. Apply the checked-in files in `supabase/migrations` in numeric order (`0000_...sql`, then `0001_...sql`). You can run their SQL in the Supabase SQL Editor, or use the Supabase CLI after linking the project:

   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   ```

   `supabase db push` relies on the Supabase CLI migration history. If these SQL files were already run manually or the database is not initialized for CLI migrations, do not blindly push and risk reapplying them. Check the project's migration history first, then either reconcile it with the CLI or apply only the pending SQL in the SQL Editor. Do not apply a migration twice.

To change the schema, edit `src/db/schema.ts`, then generate a versioned SQL migration and review it before applying it:

```bash
npx drizzle-kit generate --name describe_the_change
```

Drizzle Kit's direct schema push bypasses the checked-in migration workflow. Use it only on a disposable development database when you intentionally want to sync the current schema directly:

```bash
npx drizzle-kit push
```

## Default User Login Credentials

Campus Copilot includes preconfigured default user credentials for testing student, faculty, and administrative workflows in both **Demo Mode** (browser-local session) and **Supabase Mode** (hosted database and authentication).

| Role | Name | Email | Password | Access / Portal |
| --- | --- | --- | --- | --- |
| **Admin** | Campus Administrator | `admin@silveroak.edu` | `AdminPassword123!` | Full access to Admin Portal (`/admin`), user management, notices, feedback |
| **Student (Primary)** | Sahil Vaibhav | `sahil.v@silveroak.edu` | `StudentPassword123!` | Student dashboard (`/dashboard`), timetable, copilot, library, campus services |
| **Student (General)** | Jane Doe | `student@silveroak.edu` | `StudentPassword123!` | Student workspace, copilot chat, feedback submission |
| **Faculty (Head)** | Dr. A. Sharma | `asharma@silveroak.edu` | `FacultyPassword123!` | Departmental workspace, timetable schedule, student notices |
| **Faculty (Lecturer)** | Prof. N. Patel | `npatel@silveroak.edu` | `FacultyPassword123!` | Academic courses, faculty directory, library access |

> [!TIP]
> - **Demo Mode**: When Supabase is not connected, enter any of the above emails with their password (minimum 6 characters) to sign in immediately. Entering `admin@silveroak.edu` automatically routes you to the **Admin Portal** (`/admin`).
> - **Supabase Mode**: Run the database seed script (`npm run db:seed`) to populate database tables and register/seed auth accounts.

## Database Seeding

The repository provides a seeding script (`src/db/seed.ts`) and a standard Supabase SQL seed file (`supabase/seed.sql`) to initialize your PostgreSQL database with complete sample campus data:

- **Users**: Admin, faculty, and student profiles
- **Notices**: Examination schedules, placement drives, tech fest events, and emergency alerts
- **Timetable**: Full Monday through Saturday lecture, lab, and workshop schedules
- **Library Books**: Computer Science, AI, and Software Engineering textbooks with availability states
- **Feedback**: Sample student feedback entries with categories, priority levels, and statuses

### 1. Seeding via TypeScript / Drizzle (`npm run db:seed`)

Set your database connection string in `.env`:

```env
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
# Optional: set for creating verified Supabase Auth accounts
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret
```

Then execute:

```bash
npm run db:seed
```

### 2. Seeding via Supabase SQL Editor or Supabase CLI

If you prefer applying SQL directly in the Supabase Dashboard:

1. Open your Supabase project dashboard and navigate to **SQL Editor**.
2. Open [`supabase/seed.sql`](file:///c:/Users/Sahil/OneDrive/Desktop/Campus%20Copilot/supabase/seed.sql) and paste its contents into the editor.
3. Click **Run**. All initial users, notices, timetable blocks, library books, and feedback records will be inserted.

If using the Supabase CLI locally:

```bash
supabase db reset
```
*(Supabase CLI automatically applies all migrations in `supabase/migrations` followed by `supabase/seed.sql`).*

## Routes

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/login`, `/register`, `/forgot-password` | Authentication |
| `/dashboard`, `/copilot`, `/timetable` | Student workspace |
| `/notices`, `/notices/:id` | Campus announcements |
| `/library`, `/faculty`, `/services` | Campus resources |
| `/feedback`, `/profile`, `/settings` | Student account tools |
| `/admin`, `/admin/users`, `/admin/notices`, `/admin/feedback` | Admin workspace |

## Architecture

```text
src/
  components/     Shared UI, PWA prompt, and application layouts
  contexts/       Authentication and theme contexts
  data/           Fictional sample campus data
  db/             Drizzle PostgreSQL schema
  lib/            Shared utilities and Supabase client
  pages/           Student, public, and admin screens
  services/       AI and API service abstractions
  types/           Shared application types
  pwa.ts           Service worker registration
public/
  manifest.webmanifest
  sw.js             Offline app-shell service worker
  offline.html      Network fallback
supabase/
  migrations/      Versioned PostgreSQL migration SQL
```

The mock AI implementation is called through an `AiService` interface so a future server-backed LLM and retrieval layer can replace it without coupling provider code to the chat UI. Keep secrets and privileged operations on a trusted backend. The browser service worker caches the app shell and same-origin static build assets; it does not cache API or auth requests.

## Scripts

- `npm run dev` — start the local Vite development server
- `npm run build` — run the TypeScript project build and create an optimized production bundle
- `npm run preview` — serve the production bundle locally
- `npm run lint` — run Oxlint
- `npm test` — run the Vitest suite
- `npm run db:seed` (or `npm run seed`) — run the database and Supabase Auth seeding script
- `npm run db:generate` — generate new Drizzle migrations from schema changes
- `npm run db:push` — directly push the current schema to PostgreSQL (development only)

## Future work

- Server-side authorization and managed roles; Supabase row-level security policies.
- Persist notices, timetable, and library data through a REST API.
- Add a server-side retrieval-augmented campus knowledge service for grounded AI responses.
- Add automated accessibility and offline-install checks.

## License

MIT
