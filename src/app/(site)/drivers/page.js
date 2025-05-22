export default async function DriversPage() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return (
    <div>
      <h1>Drivers</h1>
      <p>Welcome to the drivers page</p>
    </div>
  );
}
