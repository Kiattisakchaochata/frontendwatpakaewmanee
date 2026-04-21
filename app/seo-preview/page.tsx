import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Source Preview",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

async function getPrettyHtml() {
  const targetUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const res = await fetch(targetUrl, {
      cache: "no-store",
    });

    const html = await res.text();

    return html
      .replace(/></g, ">\n<")
      .replace(/<script/g, "\n<script")
      .replace(/<\/script>/g, "</script>\n")
      .replace(/<style/g, "\n<style")
      .replace(/<\/style>/g, "</style>\n");
  } catch (error) {
    console.error("source-preview error:", error);
    return "ไม่สามารถดึง source ของหน้าเว็บได้";
  }
}

export default async function SourcePreviewPage() {
  const prettyHtml = await getPrettyHtml();

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
          <h1 className="text-lg font-bold md:text-xl">Source Preview</h1>
          <p className="mt-1 text-sm text-white/70">
            หน้านี้ใช้สำหรับดู HTML source แบบหลายบรรทัดให้อ่านง่าย
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black p-4 shadow-2xl">
          <pre className="whitespace-pre-wrap break-words text-[12px] leading-6 text-green-300 md:text-[13px]">
            {prettyHtml}
          </pre>
        </div>
      </div>
    </main>
  );
}