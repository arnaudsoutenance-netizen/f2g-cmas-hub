import type { Metadata } from "next";
import { Baloo_2, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const display = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-baloo",
  display: "swap",
});
const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-plex-sans",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "CMAS Hub · F2G", template: "%s · CMAS Hub" },
  description: "Cell Broadcast emergency alert console (CMAS/ETWS) for Cameroon.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", type: "image/png", sizes: "192x192", url: "/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", url: "/icon-512.png" },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
