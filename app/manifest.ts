import type { MetadataRoute } from "next";

/** Web app manifest so the shipped 192/512 icons are installable / add-to-home. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mrs Plumbob Challenges",
    short_name: "Mrs Plumbob",
    description:
      "Every Sims 4 challenge, written clearly and filtered to the packs you actually own.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff2f8",
    theme_color: "#fff2f8",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
