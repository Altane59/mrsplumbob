import { Suspense } from "react";
import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search every Sims 4 challenge by title, theme or type.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="section" />}>
      <SearchClient />
    </Suspense>
  );
}
