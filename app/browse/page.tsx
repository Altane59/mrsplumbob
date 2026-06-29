import { Suspense } from "react";
import type { Metadata } from "next";
import BrowseClient from "./BrowseClient";

export const metadata: Metadata = {
  title: "Browse challenges",
  description:
    "Browse every Sims 4 challenge with live playability badges for the packs you own.",
};

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="section" />}>
      <BrowseClient />
    </Suspense>
  );
}
