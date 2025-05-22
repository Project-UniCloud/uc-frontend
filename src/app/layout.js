import "./globals.css";
import StoreProvider from "@/providers/ReduxProvider";
import ReactQueryProvider from "@/providers/QueryProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <ReactQueryProvider>
          <StoreProvider>{children}</StoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
