# Unicloud – Frontend (uc-frontend)

Frontend aplikacji **Unicloud** – panel webowy oparty o **Next.js (App Router)**. Projekt renderuje UI (logowanie, dashboard, grupy, logi itd.) i komunikuje się z backendem przez HTTP (z użyciem cookies/credentials).

## Tech stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS v4** (przez `@tailwindcss/postcss`)
- **@tanstack/react-query** – cache/fetching i mutacje w UI
- **Jest + Testing Library** – testy jednostkowe komponentów

Zależności pomocnicze: `react-hook-form`, `zod`, `react-toastify`, `recharts`, `react-dnd`, `axios` (w zależności od modułu).

## Jak to działa (architektura)

### Routing (App Router)

Kod stron jest w `src/app/` i korzysta z **route groups**:

- `src/app/(auth)/...` – ścieżki związane z logowaniem (np. `/login`)
- `src/app/(site)/...` – właściwa aplikacja po zalogowaniu (dashboard, grupy, logi itd.)

Główne layouty:

- `src/app/layout.js` – Root layout, podpina globalne style i `ReactQueryProvider`
- `src/app/(site)/layout.js` – layout aplikacji (Sidebar + Navbar + Toasty) oraz kontekst ról

### Auth i role

Autoryzacja bazuje na cookies ustawianych przez backend:

- `jwt` – token sesyjny
- `roles` – role użytkownika (format: pojedyncza rola lub kilka ról rozdzielonych myślnikiem, np. `ADMIN-LECTURER`)

Obsługa ról:

1. `src/middleware.js`:
   - sprawdza, czy użytkownik jest zalogowany i dokonuje odpowiedniego redirect: `/login` lub `/dashboard`
   - ogranicza dostęp do wybranych tras na podstawie `src/lib/utils/permissions.js`
2. `src/app/(site)/layout.js`:
   - odczytuje `x-user-role` przez `next/headers`
   - przekazuje role do `RolesProvider`
3. UI:
   - `src/hooks/usePermissions.js` udostępnia `isAdmin/isLecturer/isStudent` oraz `checkAccess(...)` do warunkowego renderowania.

### Warstwa API

Standardowe wywołania HTTP realizuje `src/lib/utils/apiClient.js` (wrapper na `fetch`):

- wysyła `credentials: "include"` (cookies do backendu)
- na `401` przekierowuje na `/login`
- wystawia helpery: `getApi`, `postApi`, `patchApi`, `putApi`, `deleteApi`

Endpointy są pogrupowane w `src/lib/api/*Api.js` (np. `groupsApi.js`, `logsApi.js`)

### Logika widoków

Dostępna w `src/lib/views/**`. Jest pogrupowana według obszaru aplikacji i routingu (np. logika związana z grupami znajduje się w `src/lib/views/groups/**`, a elementy dla logów w `src/lib/views/logs/**`).

Najczęściej spotkasz tam:

- columns.js - definicja kolumn do tabel
- hooks.js - obsługa wszystkich akcji w widoku tj. edycja danych, obsługa zapytań asynchronicznych.
- schemas.js - definicja schematów do walidacji
- tabs.js - definicja dostępnych zakładek

## Struktura katalogów

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
├── public/                          # Statyczne assety (np. logo)
└── src/
    ├── middleware.js                # Auth/roles + ochrona tras + wstrzyknięcie nagłówka
    ├── app/                         # Next.js App Router
    │   ├── (auth)/                  # Route group: logowanie
    │   │   ├── login/               # /login
    │   │   │   └── page.js
    │   │   └── layout.js
    │   ├── (site)/                  # Route group: aplikacja po zalogowaniu
    │   │   ├── dashboard/           # /dashboard
    │   │   ├── drivers/             # /drivers
    │   │   ├── groups/              # /groups (+ pod-routy grup)
    │   │   ├── list-lecturers/      # /list-lecturers
    │   │   ├── logs/                # /logs
    │   │   ├── layout.js            # Sidebar + Navbar + RolesProvider + ToastContainer
    │   │   ├── loading.js           # loading UI dla (site)
    │   │   └── not-found.js
    │   ├── globals.css
    │   ├── layout.js                # Root layout + ReactQueryProvider + window.ENV
    │   ├── not-found.js
    │   └── page.js
    ├── components/                  # Komponenty UI
    │   ├── main/                    # Navbar/Sidebar
    │   ├── table/                   # Wspólna tabela
    │   ├── utils/                   # Wspólne kontrolki (Tabs, Toast, TeacherSearchInput, ...)
    │   ├── group/                   # Modale/akcje dla grup
    │   ├── drivers/                 # Modale/akcje dla kierowców
    │   ├── lecturer/                # Modale/akcje dla prowadzących
    │   ├── resources/               # Modale/akcje dla usług/zasobów
    │   ├── students/                # Modale/akcje dla studentów
    │   ├── login/                   # Formularze logowania
    │   └── dahsboard/               # Komponenty dashboardu (uwaga: nazwa katalogu w repo)
    ├── contexts/                    # React Context (RolesContext)
    ├── hooks/                       # Hooki współdzielone (np. usePermissions)
    ├── providers/                   # Providerzy globalni (np. ReactQueryProvider)
    ├── store/                       # Pozostałości po Redux (slice/config) – do ewentualnego cleanup
    └── lib/
        ├── api/                     # Moduły wywołań endpointów (groupsApi, logsApi, ...)
        ├── utils/                   # Utility (apiClient, baseUrl, permissions, formatDate, ...)
        └── views/                   # Logika widoków (columns/hooks/schemas/tabs) pogrupowana per obszar
            ├── auth/
            ├── dashboard/
            ├── drivers/
            ├── groups/
            ├── list-lecturers/
            ├── logs/
            └── shared/
```

## Uruchomienie

### Wymagania

- Node.js **20.x** (projekt ma Dockerfile na `node:20-alpine`)
- npm
- Git

### Sklonuj repozytorium

```bash
git clone https://github.com/Project-UniCloud/uc-frontend.git
cd uc-frontend
```

### Dev (lokalnie)

```bash
npm install
npm run dev
```

Aplikacja: http://localhost:3000

### Build + start (prod)

```bash
npm run build
npm start
```

### Testy

```bash
npm test
```

Tryb watch:

```bash
npm run test:watch
```

Po uruchomieniu testów generowany jest raport HTML: `test-report.html`.

### Konfiguracja URL backendu, z którym komunikuje się frontend

Funkcja `getBaseApiUrl()` znajduje się w `src/lib/utils/baseUrl.js`. Bierzę ona zmienną środowiskową `BACKEND_API_URL` z dockera. Aby zmienić używany port zmień powyższą zmienną lub wykorzystaj fallback.
