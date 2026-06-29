import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { challenges } from "@/lib/challenges";

/** All public routes + every challenge page, for search engines. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/browse",
    "/search",
    "/surprise",
    "/packs",
    "/progress",
    "/support",
    "/about",
    "/privacy",
    "/guidelines",
  ];

  const staticEntries = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.6,
  }));

  const challengeEntries = challenges.map((c) => ({
    url: `${SITE_URL}/challenge/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...challengeEntries];
}
