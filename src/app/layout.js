export const dynamic = "force-dynamic";
import "./globals.css";
import ReactQueryProvider from "@/providers/QueryProvider";

export default async function RootLayout({ children }) {
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8080/api";

  return (
    <html lang="en">
      <body className="bg-white">
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = { BACKEND_API_URL: '${backendUrl}' };`,
          }}
        />

        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
