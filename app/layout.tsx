import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://watpakaewmanee.com";
const siteName = "วัดป่าแก้วมณีนพเก้า";
const defaultTitle = "วัดป่าแก้วมณีนพเก้า";
const defaultDescription =
  "เว็บไซต์วัดป่าแก้วมณีนพเก้า รวมข้อมูลประวัติวัด กิจกรรมทางศาสนา ธรรมเทศนา แกลเลอรี และข้อมูลการเดินทางมายังวัด";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    "วัดป่าแก้วมณีนพเก้า",
    "วัด",
    "ธรรมะ",
    "ธรรมเทศนา",
    "กิจกรรมวัด",
    "ทำบุญ",
    "แกลเลอรีวัด",
    "พระนครศรีอยุธยา",
    "ลาดบัวหลวง",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 1200,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/logo.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.jpg", type: "image/jpeg" },
    ],
    apple: [{ url: "/icon.jpg" }],
    shortcut: ["/favicon.ico"],
  },
  category: "religion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        inLanguage: "th-TH",
        description: defaultDescription,
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.jpg`,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: defaultTitle,
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        inLanguage: "th-TH",
        description: defaultDescription,
      },
      {
        "@type": "Place",
        "@id": `${siteUrl}/#place`,
        name: siteName,
        url: siteUrl,
        image: `${siteUrl}/logo.jpg`,
      },
    ],
  };

  return (
    <html
      lang="th"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        <script
          id="ld-json-site"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd, null, 2),
          }}
        />
      </body>
    </html>
  );
}