"use client";

import useSWR from "swr";

export type SiteContent = {
  id?: string;
  templeName?: string;
  templeEnglishName?: string;
  heroTitle?: string;
  heroDescription?: string;

  heroImageUrl?: string;
  heroImagePublicId?: string;

  heroImageUrl2?: string;
  heroImagePublicId2?: string;

  heroImageUrl3?: string;
  heroImagePublicId3?: string;

  aboutTitle?: string;
  aboutDescription?: string;
  aboutImageUrl?: string;
  aboutImagePublicId?: string;

  contactTitle?: string;
  address?: string;
  phone?: string;
  openingHours?: string;
  googleMapUrl?: string;
  mapEmbedUrl?: string;

  createdAt?: string;
  updatedAt?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

const fetcher = async (url: string): Promise<SiteContent> => {
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("โหลดข้อมูลเว็บไซต์ไม่สำเร็จ");
  }

  return res.json();
};

export function useSiteContent() {
  const { data, error, isLoading, mutate } = useSWR<SiteContent>(
    `${API_URL}/site-content`,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}