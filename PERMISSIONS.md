# System Ról i Uprawnień

## Dodane pliki:

- `src/lib/utils/permissions.js` - Konfiguracja ról i uprawnień
- `src/hooks/usePermissions.js` - Custom hook do sprawdzania uprawnień

## Zmiany w istniejących plikach:

- `src/store/authSlice.js` - Dodano pole `role` do state
- `src/components/main/Sidebar.jsx` - Dodano warunkowe renderowanie zakładek

## Jak używać:

### 1. Podczas logowania zapisz rolę użytkownika:

```javascript
import { loginSuccess } from "@/store/authSlice";
import { useDispatch } from "react-redux";

const dispatch = useDispatch();

// Przykład logowania z API
const response = await fetch("/api/login", { ... });
const data = await response.json();

dispatch(loginSuccess({
  user: data.user,
  role: data.role // np. "admin", "lecturer", "student"
}));
```

### 2. Użycie w komponentach - Metoda 1 (Hook):

```javascript
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/utils/permissions";

function MyComponent() {
  const { checkAccess, isAdmin, isLecturer } = usePermissions();

  return (
    <>
      {/* Sprawdzanie konkretnej roli */}
      {isAdmin && <AdminPanel />}

      {/* Sprawdzanie wielu ról */}
      {checkAccess(PERMISSIONS.LECTURERS) && <LecturerSection />}

      {/* Sprawdzanie custom ról */}
      {checkAccess(["admin", "moderator"]) && <ModeratorTools />}
    </>
  );
}
```

### 3. Użycie w komponentach - Metoda 2 (Redux):

```javascript
import { useSelector } from "react-redux";

function MyComponent() {
  const userRole = useSelector((state) => state.auth.role);

  return <>{userRole === "admin" && <AdminPanel />}</>;
}
```

### 4. Dodawanie nowych uprawnień:

Edytuj plik `src/lib/utils/permissions.js`:

```javascript
export const PERMISSIONS = {
  DASHBOARD: [ROLES.ADMIN, ROLES.LECTURER, ROLES.STUDENT],
  GROUPS: [ROLES.ADMIN, ROLES.LECTURER, ROLES.STUDENT],
  SETTINGS: [ROLES.ADMIN], // Nowa sekcja
  // ... dodaj więcej
};
```

### 5. Ochrona całych stron (middleware):

Możesz użyć middleware w Next.js do ochrony tras:

```javascript
// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  // Pobierz rolę z cookie/session
  const role = request.cookies.get("userRole")?.value;

  // Sprawdź dostęp do konkretnej ścieżki
  if (request.nextUrl.pathname.startsWith("/drivers")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}
```

## Dostępne role:

- `admin` - Administrator (pełny dostęp)
- `lecturer` - Prowadzący (ograniczony dostęp)
- `student` - Student (podstawowy dostęp)

## Obecnie skonfigurowane uprawnienia:

- **Dashboard** - wszyscy
- **Grupy** - wszyscy
- **Powiadomienia** - wszyscy
- **Prowadzący** - admin, lecturer
- **Sterowniki** - tylko admin
