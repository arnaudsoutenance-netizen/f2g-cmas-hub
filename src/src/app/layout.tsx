import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "F2G CMAS Hub | Cell Broadcast Emergency Alert System",
  description:
    "Plateforme de gestion des alertes Cell Broadcast pour le Cameroun - F2G Solutions & KFOKAM48 Academy",
  keywords: ["CMAS", "Cell Broadcast", "Emergency Alert", "Cameroon", "F2G"],
  authors: [{ name: "Arnaud DJOUM", url: "https://f2g.cm" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
