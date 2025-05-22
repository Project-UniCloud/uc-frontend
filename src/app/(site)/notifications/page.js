export default async function NotificationsPage() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return (
    <div>
      <h1>Notifications</h1>
      <p>Welcome to the notifications page</p>
    </div>
  );
}
