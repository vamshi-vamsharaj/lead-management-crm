<div align="center">

# LeadFlow CRM

### A production-grade Lead Management System built for modern sales teams.
### Clean architecture. Premium UI. Full-stack engineering.



<!-- Tech Badges -->
![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?style=flat-square&logo=tailwindcss&logoColor=38BDF8)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon_DB-00E699?style=flat-square&logo=neon&logoColor=black)

<br />

<!-- Status Badges -->
![Status](https://img.shields.io/badge/Status-Production_Ready-10B981?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-7C6AF7?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-F59E0B?style=flat-square)

<br />

<!-- CTA Links -->
<a href="https://leadflow-sigma-ten.vercel.app">
  <img src="https://img.shields.io/badge/🚀_Live_Demo-View_App-7C6AF7?style=for-the-badge&labelColor=13151E" alt="Live Demo" />
</a>
&nbsp;&nbsp;
<a href="https://github.com/vamshi-vamsharaj/lead-management-crm">
  <img src="https://img.shields.io/badge/⭐_GitHub-View_Source-F0F2F8?style=for-the-badge&labelColor=13151E" alt="GitHub" />
</a>

<br /><br />

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

**📊 Dashboard & Analytics**
- Live pipeline stats (total, interested, converted)
- Conversion rate calculation
- Leads added this week
- Real-time data sync with React Query

**👥 Lead Management**
- Add leads via polished slide-over sheet
- View all leads in a premium data table
- Update status with instant optimistic UI
- Delete with confirmation modal & rollback

</td>
<td width="50%">

**🔍 Search & Filtering**
- Full-text search on name and phone
- Filter by status and source channel
- Combined filters with live URL sync
- One-click filter reset

**🛡️ Data Integrity**
- Zod validation on frontend and backend
- Duplicate phone number prevention
- PostgreSQL constraints & enums
- Centralized error handling

</td>
</tr>
<tr>
<td width="50%">

**⚡ Performance & UX**
- Optimistic updates — instant UI feedback
- Skeleton loaders (no blank screens ever)
- Stale-while-revalidate caching strategy
- Background re-sync on window focus

</td>
<td width="50%">

**🎨 Premium UI/UX**
- Dark SaaS design system with custom tokens
- Animated status badges & source chips
- Deterministic avatar generation per lead
- Framer-ready micro-interaction system

</td>
</tr>
</table>

---

## 🏗️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18 | UI component framework |
| **Vite** | 5 | Lightning-fast build tool & dev server |
| **Tailwind CSS** | 3 | Utility-first design system |
| **TanStack React Query** | 5 | Async state, caching & mutations |
| **Axios** | 1.7 | HTTP client with interceptors |
| **React Hook Form** | 7 | Performant uncontrolled forms |
| **Zod** | 3 | Schema validation (shared with backend) |
| **React Router DOM** | 6 | Client-side routing |
| **React Hot Toast** | 2 | Toast notification system |
| **Lucide React** | latest | Consistent icon library |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | JavaScript runtime |
| **Express.js** | 4 | HTTP server framework |
| **node-postgres (pg)** | 8 | PostgreSQL driver with connection pooling |
| **Zod** | 3 | Request body & query param validation |
| **Morgan** | 1 | HTTP request logging |
| **CORS** | 2 | Cross-origin resource sharing |
| **dotenv** | 16 | Environment variable management |

### Infrastructure & Deployment

| Service | Role |
|---|---|
| **Vercel** | Frontend hosting with automatic CI/CD |
| **Render** | Backend Node.js server hosting |
| **Neon** | Serverless PostgreSQL with connection pooling |
| **GitHub** | Version control & source of truth |

---

## 🧠 Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Vercel)                          │
│                                                                   │
│  Pages           Components          Services                    │
│  ├── /           ├── AppLayout       ├── axios.config.js         │
│  │   Dashboard   ├── Sidebar             └── interceptors         │
│  │               ├── TopBar          ├── leads.api.js             │
│  └── /leads      ├── LeadsTable          └── API functions        │
│      Leads       ├── AddLeadSheet                                 │
│                  └── StatusDropdown   Hooks (React Query)         │
│                                       ├── useLeadsQuery           │
│                                       ├── useCreateLeadMutation   │
│                                       ├── useUpdateLeadMutation   │
│                                       └── useDeleteLeadMutation   │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS / REST
                          │ /api/v1/*
┌─────────────────────────▼───────────────────────────────────────┐
│                        SERVER (Render)                           │
│                                                                   │
│  Request Pipeline:                                                │
│  CORS → Body Parser → Morgan → Routes → Validate → Controller    │
│                                                                   │
│  src/                                                             │
│  ├── routes/v1/leads.routes.js    (URL → middleware → handler)   │
│  ├── controllers/leads.controller.js  (HTTP in/out — thin)       │
│  ├── services/leads.service.js        (Business logic)           │
│  ├── repositories/leads.repository.js (All SQL lives here)       │
│  ├── middleware/                                                  │
│  │   ├── validate.js        (Zod schema middleware)              │
│  │   ├── errorHandler.js    (Global error catcher)               │
│  │   └── notFound.js        (404 for undefined routes)           │
│  └── utils/                                                       │
│      ├── ApiError.js         (Custom error class)                │
│      ├── ApiResponse.js      (Consistent response envelope)      │
│      └── asyncHandler.js     (Async try/catch eliminator)        │
└─────────────────────────┬───────────────────────────────────────┘
                          │ SSL / Pooled Connections
┌─────────────────────────▼───────────────────────────────────────┐
│                     DATABASE (Neon)                              │
│                                                                   │
│  leads table                                                      │
│  ├── id          UUID PRIMARY KEY DEFAULT gen_random_uuid()      │
│  ├── name        VARCHAR(100) NOT NULL                           │
│  ├── phone       VARCHAR(20)  NOT NULL UNIQUE                    │
│  ├── source      ENUM('call','whatsapp','field')                 │
│  ├── status      ENUM('new','interested','not_interested',       │
│  │               'converted') DEFAULT 'new'                       │
│  ├── notes       TEXT NULLABLE                                   │
│  ├── created_at  TIMESTAMPTZ DEFAULT NOW()                       │
│  └── updated_at  TIMESTAMPTZ DEFAULT NOW()  ← auto-trigger       │
└─────────────────────────────────────────────────────────────────┘
```

### React Query Caching Strategy

```
Component mounts
  └── useLeadsQuery(filters) called
        └── Is data in cache and fresh? (staleTime: 30s)
              ├── YES → Return cached data instantly (0ms)
              └── NO  → Fetch from API
                          └── Cache result → Render data

User updates a lead status
  └── useUpdateLeadStatusMutation fires
        ├── onMutate:   Snapshot cache → Apply optimistic update (instant UI)
        ├── API request fires in background
        ├── onSuccess:  Invalidate ['leads'] cache → Background refetch
        └── onError:    Restore snapshot (rollback) → Toast error
```

### API Response Envelope

Every endpoint returns the same shape — predictable for the frontend, always:

```json
// Success
{ "success": true, "message": "Leads fetched successfully", "data": { ... } }

// Error
{ "success": false, "message": "Validation failed", "errors": [{ "field": "phone", "message": "Required" }] }
```

---

## 📁 Project Structure

```
lead-management-crm/
│
├── client/                          # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Shared UI primitives
│   │   │   │   ├── Avatar.jsx           Deterministic initials avatar
│   │   │   │   ├── StatusBadge.jsx      Color-coded status pill
│   │   │   │   ├── SourceBadge.jsx      Channel icon + label pill
│   │   │   │   ├── SkeletonTable.jsx    Shimmer loading rows
│   │   │   │   └── EmptyState.jsx       Illustrated empty/no-results
│   │   │   └── layout/              # App shell components
│   │   │       ├── AppLayout.jsx        Root layout + context
│   │   │       ├── Sidebar.jsx          Desktop + mobile drawer
│   │   │       └── TopBar.jsx           Sticky header + actions
│   │   │
│   │   ├── features/                # Feature-sliced architecture
│   │   │   ├── leads/
│   │   │   │   ├── components/
│   │   │   │   │   ├── LeadsTable.jsx
│   │   │   │   │   ├── AddLeadSheet.jsx
│   │   │   │   │   ├── StatusUpdateDropdown.jsx
│   │   │   │   │   ├── DeleteConfirmModal.jsx
│   │   │   │   │   └── LeadFilters.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useLeads.js      All React Query hooks
│   │   │   │   └── leads.schema.js      Zod form validation schema
│   │   │   └── dashboard/
│   │   │       ├── components/
│   │   │       │   └── StatsGrid.jsx    4-up stat cards
│   │   │       └── hooks/
│   │   │           └── useDashboard.js
│   │   │
│   │   ├── services/api/            # HTTP layer
│   │   │   ├── axios.config.js          Instance + interceptors
│   │   │   └── leads.api.js             All lead API functions
│   │   │
│   │   ├── lib/
│   │   │   └── utils.js                 cn(), formatDate(), getInitials()
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   └── LeadsPage.jsx
│   │   ├── App.jsx                  QueryClient + Router setup
│   │   ├── main.jsx
│   │   └── index.css                Design system + Tailwind layers
│   │
│   ├── tailwind.config.js           Custom design tokens
│   ├── vite.config.js               Proxy + path aliases
│   └── package.json
│
├── server/                          # Node.js + Express backend
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 001_create_leads_table.sql   Schema, enums, indexes, trigger
│   │   │   └── run.js                       Programmatic migration runner
│   │   └── seeds/
│   │       ├── 001_sample_leads.sql         10 realistic seed rows
│   │       └── run.js
│   │
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js               Validates env vars at startup
│   │   │   └── db.js                pg Pool singleton
│   │   ├── routes/v1/
│   │   │   ├── index.js             Combines all v1 routes + /health
│   │   │   └── leads.routes.js      URL → middleware → controller map
│   │   ├── controllers/
│   │   │   └── leads.controller.js  Thin HTTP adapter
│   │   ├── services/
│   │   │   └── leads.service.js     Business rules
│   │   ├── repositories/
│   │   │   └── leads.repository.js  All SQL (parameterized)
│   │   ├── middleware/
│   │   │   ├── errorHandler.js      Global error + pg error translation
│   │   │   ├── validate.js          Zod middleware factory
│   │   │   └── notFound.js          404 for unknown routes
│   │   ├── validators/
│   │   │   └── leads.validator.js   Zod schemas: create, updateStatus
│   │   ├── utils/
│   │   │   ├── ApiError.js          Custom error class
│   │   │   ├── ApiResponse.js       Response envelope formatter
│   │   │   ├── asyncHandler.js      Async wrapper (no try/catch)
│   │   │   └── constants.js         Enums, HTTP codes, pagination
│   │   └── app.js                   Express app config
│   │
│   ├── server.js                    Entry point + graceful shutdown
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ — [Download](https://nodejs.org)
- **PostgreSQL** 14+ or a [Neon](https://neon.tech) account (free tier)
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/vamshi-vamsharaj/lead-management-crm.git
cd lead-management-crm
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Copy the environment template and fill in your values:

```bash
cp .env.example .env
```

Run database migrations:

```bash
npm run migrate
```

Seed sample data (optional but recommended for development):

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
# → API running at http://localhost:5000/api/v1
```

---

### 3. Frontend Setup

```bash
cd client
npm install
```

Copy the environment template:

```bash
cp .env.example .env
```

Start the Vite development server:

```bash
npm run dev
# → App running at http://localhost:5173
```

> The Vite dev server proxies `/api/*` to `http://localhost:5000` automatically — no CORS issues locally.

---

## 🔐 Environment Variables

### Backend — `server/.env`

```env
# ── Server ──────────────────────────────

NODE_ENV=development
PORT=5000

# ── PostgreSQL / Neon Database ──────────

DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# ── Frontend URL ────────────────────────

CORS_ORIGIN=http://localhost:5173


# ── CORS ────────────────────────────────
CORS_ORIGIN=http://localhost:5173
```

> **For Neon:** Set `DB_SSL=true` and use the connection string credentials from your Neon dashboard. Neon requires SSL for all connections.

### Frontend — `client/.env`

```env
# Only needed in production builds
# Locally, Vite proxies /api to localhost:5000
VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
```

---

## 📡 API Reference

**Base URL:** `https://your-backend.onrender.com/api/v1`

All endpoints return a consistent JSON envelope:

```json
{ "success": true | false, "message": "string", "data": { } }
```

---

### Leads

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/leads` | Get all leads (supports filtering & pagination) |
| `GET` | `/leads/stats` | Get dashboard aggregate statistics |
| `GET` | `/leads/:id` | Get a single lead by UUID |
| `POST` | `/leads` | Create a new lead |
| `PATCH` | `/leads/:id/status` | Update a lead's status |
| `DELETE` | `/leads/:id` | Permanently delete a lead |
| `GET` | `/health` | Health check endpoint |

---

#### `GET /leads` — Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `search` | `string` | Case-insensitive search on name or phone |
| `status` | `enum` | `new` \| `interested` \| `not_interested` \| `converted` |
| `source` | `enum` | `call` \| `whatsapp` \| `field` |
| `page` | `number` | Page number (default: `1`) |
| `limit` | `number` | Results per page (default: `20`, max: `100`) |

**Example:**
```bash
GET /api/v1/leads?status=interested&source=call&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": {
    "leads": [{ "id": "uuid", "name": "Ravi Kumar", "phone": "+91-9812345670", "source": "call", "status": "interested", "created_at": "2025-01-01T00:00:00Z" }],
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

#### `POST /leads` — Create Lead

```bash
POST /api/v1/leads
Content-Type: application/json

{
  "name": "Ravi Kumar",
  "phone": "+91-9812345670",
  "source": "call",
  "notes": "Met at Delhi expo. Interested in premium plan."
}
```

**Validation Rules:**
- `name`: required, 2–100 characters
- `phone`: required, unique, digits/+/-/spaces only
- `source`: required, one of `call` / `whatsapp` / `field`
- `notes`: optional, max 1000 characters

| Response Code | Meaning |
|---|---|
| `201` | Lead created successfully |
| `400` | Validation failed (field-level errors returned) |
| `409` | Phone number already exists |

---

#### `PATCH /leads/:id/status` — Update Status

```bash
PATCH /api/v1/leads/:id/status
Content-Type: application/json

{ "status": "converted" }
```

Valid values: `new` · `interested` · `not_interested` · `converted`

---

#### `GET /leads/stats` — Dashboard Statistics

```json
{
  "success": true,
  "data": {
    "total": 42,
    "new": 12,
    "interested": 15,
    "notInterested": 8,
    "converted": 7,
    "addedThisWeek": 9,
    "conversionRate": 16
  }
}
```

---

## ☁️ Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import repository at [vercel.com](https://vercel.com)
3. Set **Framework Preset** → Vite
4. Set **Root Directory** → `client`
5. Add environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1`
6. Add `client/public/vercel.json` for React Router SPA support:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

### Backend → Render

1. Create a new **Web Service** at [render.com](https://render.com)
2. Connect GitHub repository
3. Set **Root Directory** → `server`
4. Set **Build Command** → `npm install`
5. Set **Start Command** → `node server.js`
6. Add all environment variables from `server/.env` in the Render dashboard
7. Set `NODE_ENV=production`, `DB_SSL=true`

---

### Database → Neon

1. Create a project at [neon.tech](https://neon.tech) (free tier available)
2. Copy the connection string credentials to Render environment variables
3. Ensure `DB_SSL=true` is set — Neon requires SSL for all connections
4. Run migrations: the migration runner script supports SSL automatically

---

## 🛠️ Engineering Challenges & Learnings

<details>
<summary><b>🔒 Neon Database SSL Configuration</b></summary>

Neon serverless PostgreSQL requires SSL for all connections. The `pg` connection pool needed `ssl: { rejectUnauthorized: false }` in production. The `env.js` config conditionally applies this based on `DB_SSL=true`, keeping local development without SSL friction-free.

</details>

<details>
<summary><b>🌐 CORS Between Render and Vercel</b></summary>

Cross-origin requests from `leadflow-sigma-ten.vercel.app` to the Render backend required an explicit CORS origin whitelist. Locally, Vite's proxy eliminates this entirely — meaning local development and production have different networking models that both needed handling cleanly.

</details>

<details>
<summary><b>🔄 React Router on Vercel (SPA Routing)</b></summary>

Vercel serves static files. Refreshing `/leads` returns a 404 because no static `leads/index.html` exists. The fix: a `vercel.json` rewrite rule that sends all requests to `/index.html`, letting React Router handle client-side routing.

</details>

<details>
<summary><b>⚡ Optimistic Updates & Race Conditions</b></summary>

React Query's optimistic update pattern required careful cache key design. Updating status across multiple filter combinations (e.g., `?status=interested` and `?status=converted` both cached) needed `setQueriesData` with a partial key prefix `['leads', 'list']` to update all matching cache entries simultaneously, preventing stale rows from appearing after rollback.

</details>

<details>
<summary><b>🌱 Environment Variables Across Environments</b></summary>

Managing `DB_PASSWORD`, `CORS_ORIGIN`, and `VITE_API_BASE_URL` across local, Render, and Vercel required a disciplined `.env.example` strategy — every variable documented, never committed. Vite's `VITE_` prefix requirement for client-side env vars was a key distinction from the Node.js backend approach.

</details>

---

## 🔮 Future Improvements

| Feature | Description |
|---|---|
| 🔐 **Authentication** | JWT-based auth with login/signup flow |
| 👥 **Role-Based Access Control** | Admin, Manager, and Agent permission levels |
| 📈 **Analytics Charts** | Recharts/Chart.js pipeline visualization |
| 📤 **CSV Export** | Download filtered leads as a spreadsheet |
| 📋 **Activity Log** | Per-lead timeline of all status changes |
| 🔔 **Follow-up Reminders** | Date-based lead reminders with notifications |
| 🌙 **Theme Toggle** | Light/dark mode with system preference detection |
| 📱 **PWA Support** | Offline capability and home screen install |
| 🧪 **Test Coverage** | Vitest unit tests + Playwright E2E tests |
| 🐳 **Docker** | Containerized local development with docker-compose |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch — `git checkout -b feat/your-feature`
3. Commit using Conventional Commits — `git commit -m "feat(leads): add CSV export"`
4. Push to your branch — `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

## 👨‍💻 Author

<br />

**Vamshi Shyamala**

*Full-Stack Developer*

<br />

[![GitHub](https://img.shields.io/badge/GitHub-vamshi--vamsharaj-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/vamshi-vamsharaj)
&nbsp;&nbsp;
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/vamshi-shyamala)

<br />

---

<br />

*Built with care, engineered with intent.*

*If this project helped you, consider giving it a ⭐ on GitHub.*

<br />

[![Star on GitHub](https://img.shields.io/github/stars/vamshi-vamsharaj/lead-management-crm?style=social)](https://github.com/vamshi-vamsharaj/lead-management-crm)

<br />

</div>
