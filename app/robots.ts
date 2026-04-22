import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/login", "/seo-preview"],
      },
    ],
    sitemap: "https://watpakaewmanee.com/sitemap.xml",
  };
}