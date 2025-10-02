import type { MetadataRoute } from "next";

const base =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "",         changeFrequency: "weekly",  priority: 1.0 },
    { path: "about",    changeFrequency: "monthly", priority: 0.9 },
    { path: "gallery",  changeFrequency: "weekly",  priority: 0.9 },
    { path: "upcoming", changeFrequency: "weekly",  priority: 0.8 },
    { path: "contact",  changeFrequency: "monthly", priority: 0.7 },
  ];

  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${base}/${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
