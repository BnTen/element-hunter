// app/layout.tsx
import "./globals.css";
import Header from "./Header";
import Providers from "./providers";

export const metadata = {
  title: "Element Hunter",
  description:
    "Scan any webpage in 1 click to audit SEO, content, and technologies — all synced to your personal dashboard.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
