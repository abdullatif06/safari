import type { Metadata } from "next";
import {
  Archivo,
  Archivo_Black,
  Geist,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { ActivityProvider } from "@/lib/activity";
import SmoothScroll from "@/components/SmoothScroll";

// Archivo — bold modern grotesk for headlines/UI display.
const display = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

// Archivo Black — heavy single weight for the biggest hero/poster headlines.
const heavy = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-heavy",
  display: "swap",
});

const body = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const TITLE = "Saifi صيفي — Summer events across Jordan";
const DESCRIPTION =
  "Every summer event in Jordan, in one place — concerts, festivals, heritage walks, and food markets. Free to browse, for everyone.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Saifi صيفي",
  },
  description: DESCRIPTION,
  keywords: [
    "Jordan events",
    "summer events Jordan",
    "Amman events",
    "things to do in Amman",
    "فعاليات الأردن",
    "فعاليات عمّان",
    "Saifi",
    "صيفي",
  ],
  authors: [{ name: "Saifi" }],
  applicationName: "Saifi",
  openGraph: {
    type: "website",
    siteName: "Saifi · صيفي",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    alternateLocale: "ar_JO",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      {/* suppressHydrationWarning: browser extensions (Grammarly, form fillers)
          inject attributes like data-gr-ext-installed / fdprocessedid onto the
          body before React hydrates. They're outside our control and harmless. */}
      <body
        suppressHydrationWarning
        className={`${display.variable} ${heavy.variable} ${body.variable} ${mono.variable} ${arabic.variable} font-body bg-sand-50 text-ink antialiased`}
      >
        <SmoothScroll>
          <I18nProvider>
            <ActivityProvider>{children}</ActivityProvider>
          </I18nProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
