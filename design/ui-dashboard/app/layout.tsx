import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TraceTrail Experience System",
  description: "Premium dashboard design prototype for TraceTrail"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-slate-50 antialiased">{children}</body>
    </html>
  );
}

