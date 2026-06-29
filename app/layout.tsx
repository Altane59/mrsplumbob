import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsentBanner from "@/components/ConsentBanner";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://mrsplumbobchallenges.com"),
  title: {
    default: "Mrs Plumbob Challenges — Sims 4 challenges, filtered to your packs",
    template: "%s · Mrs Plumbob Challenges",
  },
  description:
    "Every Sims 4 challenge, written clearly and filtered to the packs you actually own.",
  openGraph: {
    title: "Mrs Plumbob Challenges",
    description:
      "Every Sims 4 challenge, written clearly and filtered to the packs you actually own.",
    type: "website",
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
