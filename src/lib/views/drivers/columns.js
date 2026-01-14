import Hint from "@/components/utils/Hint";

export const columns = [
  { key: "cloudConnectorId", header: "ID" },
  { key: "cloudConnectorName", header: "Nazwa" },
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
  {
    key: "defaultCronExpression",
    header: (
      <div className="flex items-center justify-center gap-2">
        <span>Wyczyść</span>
        <span className="font-normal">
          <Hint
            hint="Harmonogram cyklicznego zadania czyszczenia. 
          Określa, jak często system automatycznie czyści zasoby (np. codziennie o północy) zgodnie z ustawieniami (cron)."
          />
        </span>
      </div>
    ),
  },
];
