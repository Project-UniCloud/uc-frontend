export default async function SettingsPage() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return (
    <div>
      <h1>Settings</h1>
      <p>Welcome to the settings page</p>
    </div>
  );
}
