export default function objectToArray(input) {
  return Object.entries(input).map(([key, val]) => {
    if (val && typeof val === "object") {
      const maybeValue = val.value ?? val.count ?? val.amount ?? null;
      if (typeof maybeValue === "number")
        return { name: key, value: maybeValue };
      if (maybeValue !== null)
        return { name: key, value: Number(maybeValue) || 0 };

      if (val.name !== undefined && val.value !== undefined)
        return { name: val.name, value: val.value };
    }
    return {
      name: key,
      value: typeof val === "number" ? val : Number(val) || 0,
    };
  });
}
