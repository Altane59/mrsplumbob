import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsentBanner from "@/components/ConsentBanner";
import { SITE_URL } from "@/lib/config";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

const SITE_DESCRIPTION =
  "Every Sims 4 challenge, written clearly and filtered to the packs you actually own.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mrs Plumbob Challenges — Sims 4 challenges, filtered to your packs",
    template: "%s · Mrs Plumbob Challenges",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mrs Plumbob Challenges",
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: "Mrs Plumbob Challenges",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mrs Plumbob Challenges",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${quicksand.variable}`}>
      <body>
        <Header />
        <main id="app" className="wrap">
          {children}
        </main>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
}
