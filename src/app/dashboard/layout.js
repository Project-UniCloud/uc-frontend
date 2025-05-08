export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
