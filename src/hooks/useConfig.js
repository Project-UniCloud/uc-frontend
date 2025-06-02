import { useEffect, useState } from "react";

export function useConfig() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch("/config.json")
      .then((res) => res.json())
      .then(setConfig)
      .catch(() => setConfig(null));
  }, []);

  return config;
}
