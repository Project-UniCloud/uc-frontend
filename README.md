# Unicloud – Frontend (uc-frontend)

Frontend for the **Unicloud** application — a web panel built on **Next.js (App Router)**. The project renders the UI (login, dashboard, groups, logs, etc.) and communicates with the backend via HTTP (using cookies/credentials).

## Tech stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **@tanstack/react-query** – caching/fetching and UI mutations
- **Jest + Testing Library** – component unit tests

Additional dependencies: `react-hook-form`, `zod`, `react-toastify`, `recharts`, `react-dnd`, `axios` (depending on the module).

## How it works (architecture)

### Routing (App Router)

Page code is in `src/app/` and uses **route groups**:

- `src/app/(auth)/...` – routes related to authentication (e.g. `/login`)
- `src/app/(site)/...` – the main app after login (dashboard, groups, logs, etc.)

Main layouts:

- `src/app/layout.js` – Root layout, registers global styles and `ReactQueryProvider`
- `src/app/(site)/layout.js` – application layout (Sidebar + Navbar + Toasts) and roles context

### Auth and roles

Authorization is based on cookies set by the backend:

- `jwt` – session token
- `roles` – user roles (format: a single role or multiple roles separated by a dash, e.g. `ADMIN-LECTURER`)

Role handling:

1. `src/middleware.js`:
   - checks whether the user is logged in and performs the appropriate redirect: `/login` or `/dashboard`
   - restricts access to selected routes based on `src/lib/utils/permissions.js`
2. `src/app/(site)/layout.js`:
   - reads `x-user-role` via `next/headers`
   - passes roles to `RolesProvider`
3. UI:
   - `src/hooks/usePermissions.js` exposes `isAdmin/isLecturer/isStudent` and `checkAccess(...)` for conditional rendering.

### API layer

Standard HTTP calls are handled by `src/lib/utils/apiClient.js` (a `fetch` wrapper):

- sends `credentials: "include"` (cookies to the backend)
- redirects to `/login` on `401`
- exposes helpers: `getApi`, `postApi`, `patchApi`, `putApi`, `deleteApi`

Endpoints are grouped in `src/lib/api/*Api.js` (e.g. `groupsApi.js`, `logsApi.js`)

### View logic

Located in `src/lib/views/**`. It is grouped by application area and routing (e.g. group-related logic is in `src/lib/views/groups/**`, and logs-related parts are in `src/lib/views/logs/**`).

Most commonly you'll find:

- columns.js - table column definitions
- hooks.js - handles all actions in the view, i.e. editing data and handling async requests.
- schemas.js - validation schema definitions
- tabs.js - available tab definitions

## Folder structure

```
uc-frontend/
├── Dockerfile
├── next.config.mjs
├── package.json
├── eslint.config.mjs
├── postcss.config.mjs
├── jest.config.js
├── jest.setup.js
├── jsconfig.json
├── public/                          # Static assets (e.g. logo)
└── src/
   ├── middleware.js                # Auth/roles + route protection + header injection
   ├── app/                         # Next.js App Router
   │   ├── (auth)/                  # Route group: authentication
   │   │   ├── login/               # /login
   │   │   │   └── page.js
   │   │   └── layout.js
   │   ├── (site)/                  # Route group: app after login
   │   │   ├── dashboard/           # /dashboard
   │   │   ├── drivers/             # /drivers
   │   │   ├── groups/              # /groups (+ group sub-routes)
   │   │   ├── list-lecturers/      # /list-lecturers
   │   │   ├── logs/                # /logs
   │   │   ├── layout.js            # Sidebar + Navbar + RolesProvider + ToastContainer
   │   │   ├── loading.js           # loading UI for (site)
   │   │   └── not-found.js
   │   ├── globals.css
   │   ├── layout.js                # Root layout + ReactQueryProvider + window.ENV
   │   ├── not-found.js
   │   └── page.js
   ├── components/                  # UI components
   │   ├── main/                    # Navbar/Sidebar
   │   ├── table/                   # Shared table
   │   ├── utils/                   # Shared controls (Tabs, Toast, TeacherSearchInput, ...)
   │   ├── group/                   # Group modals/actions
   │   ├── drivers/                 # Driver modals/actions
   │   ├── lecturer/                # Lecturer modals/actions
   │   ├── resources/               # Resource/service modals/actions
   │   ├── students/                # Student modals/actions
   │   ├── login/                   # Login forms
   │   └── dahsboard/               # Dashboard components (note: folder name in repo)
   ├── contexts/                    # React Context (RolesContext)
   ├── hooks/                       # Shared hooks (e.g. usePermissions)
   ├── providers/                   # Global providers (e.g. ReactQueryProvider)
   ├── store/                       # Leftovers after Redux (slice/config) – optional cleanup
    └── lib/
      ├── api/                     # Endpoint call modules (groupsApi, logsApi, ...)
      ├── utils/                   # Utilities (apiClient, baseUrl, permissions, formatDate, ...)
      └── views/                   # View logic (columns/hooks/schemas/tabs) grouped by area
            ├── auth/
            ├── dashboard/
            ├── drivers/
            ├── groups/
            ├── list-lecturers/
            ├── logs/
            └── shared/
```

## Running

### Requirements

- Node.js **20.x** (the project includes a Dockerfile based on `node:20-alpine`)
- npm
- Git

### Clone the repository

```bash
git clone https://github.com/Project-UniCloud/uc-frontend.git
cd uc-frontend
```

### Dev (local)

```bash
npm install
npm run dev
```

App: http://localhost:3000

### Build + start (prod)

```bash
npm run build
npm start
```

### Tests

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

After running tests, an HTML report is generated: `test-report.html`.

### Backend URL configuration

The function `getBaseApiUrl()` is located in `src/lib/utils/baseUrl.js`. It takes the `BACKEND_API_URL` environment variable from Docker. To change the port in use, change the variable above or use the fallback.
