export default async function DashboardPage() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard</p>
    </div>
  );
}
