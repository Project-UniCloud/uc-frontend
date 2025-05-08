import "./globals.css";
import StoreProvider from "@/providers/ReduxProvider";
import ReactQueryProvider from "@/providers/QueryProvider";

export const metadata = {
  title: "Unicloud",
  description: "Unicloud App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <StoreProvider>{children}</StoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
