import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/login", "/setup-2fa"],
      },
    ],
    sitemap: "https://watpakaewmanee.com/sitemap.xml",
  };
}