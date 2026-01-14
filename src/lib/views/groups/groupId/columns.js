import Hint from "@/components/utils/Hint";

export const resourcesColumns = [
  { key: "clientId", header: "ID" },
  { key: "name", header: "Nazwa" },
  {
    key: "limitUsed",
    header: (
      <div className="flex items-center justify-center gap-2">
        <span>Koszt</span>
        <span className="font-normal">
          <Hint hint="Wygenerowany koszt przez tą usługę." />
        </span>
      </div>
    ),
  },
  {
    key: "costLimit",
    header: (
      <div className="flex items-center justify-center gap-2">
        <span>Limit Kosztu</span>
        <span className="font-normal">
          <Hint
            hint="Kwota limitu kosztów.
              W szczegółach sterownika można ustawić progi powiadomień mailowych, które poinformują o przekroczeniu kosztów.
              Po przekroczeniu limitu kosztów system automatycznie wyłączy zasoby powiązane z danym sterownikiem."
          />
        </span>
      </div>
    ),
  },
  { key: "expiresAt", header: "Wygasa" },
  {
    key: "cronCleanupSchedule",
    header: (
      <div className="flex items-center justify-center gap-2">
        <span>Wyczyść</span>
        <span className="font-normal">
          <Hint
            hint="Harmonogram cyklicznego zadania czyszczenia. 
            Określa, jak często system automatycznie czyści zasoby (np. codziennie o północy) zgodnie z ustawieniami (cron).
            Można to zmienić w szczegółach sterownika."
          />
        </span>
      </div>
    ),
  },
];

export const studentsColumns = [
  { key: "login", header: "ID" },
  { key: "firstName", header: "Imię" },
  { key: "lastName", header: "Nazwisko" },
  { key: "email", header: "Mail" },
];
