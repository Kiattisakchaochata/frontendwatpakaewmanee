"use client";

import { useEffect, useState } from "react";
import {
  Loader,
  Save,
  Upload,
  ImageIcon,
  Info,
  Phone,
  Trash2,
} from "lucide-react";
import Toast from "@/app/components/ui/Toast";

type SiteContent = {
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
};

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-[#ead7b0] bg-white p-6 shadow-[0_10px_30px_rgba(166,124,46,0.08)]">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7e8] text-[#8d6720]">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-[#8d6720]">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#d9c39a] bg-white px-4 py-3 text-sm text-[#4a3b22] outline-none transition focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
      />
    </div>
  );
}

function TextareaField({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#d9c39a] bg-white px-4 py-3 text-sm text-[#4a3b22] outline-none transition focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
      />
    </div>
  );
}

function UploadBox({
  label,
  file,
  onChange,
  preview,
  placeholder,
  recommendation,
  aspectClass,
  onDelete,
  deleting,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  preview: string;
  placeholder: string;
  recommendation: React.ReactNode;
  aspectClass: string;
  onDelete?: () => void;
  deleting?: boolean;
}) {
  return (
    <div className="rounded-[24px] border border-[#ead7b0] bg-[#fffdf9] p-4">
      <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
        {label}
      </label>

      <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-[#d9c39a] bg-[#fffaf0] px-4 py-5 text-sm font-medium text-[#8d6720] transition hover:bg-[#fff7e8]">
        <Upload className="h-5 w-5" />
        <span>{file ? file.name : placeholder}</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </label>

      <div className="mt-3 rounded-2xl border border-[#ead7b0] bg-[#fffaf0] px-4 py-3 text-xs leading-6 text-[#8a7a5d]">
        {recommendation}
      </div>

      {preview && (
        <div className="mt-4 overflow-hidden rounded-[24px] border border-[#ead7b0] bg-[#fffaf0] p-3">
          <div className={`overflow-hidden rounded-[18px] bg-white ${aspectClass}`}>
            <img
              src={preview}
              alt={`${label} Preview`}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {onDelete && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    กำลังลบ...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    ลบรูป
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminSiteContentPage() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8899/api";

  const [form, setForm] = useState<SiteContent>({
    templeName: "",
    templeEnglishName: "",
    heroTitle: "",
    heroDescription: "",

    heroImageUrl: "",
    heroImagePublicId: "",

    heroImageUrl2: "",
    heroImagePublicId2: "",

    heroImageUrl3: "",
    heroImagePublicId3: "",

    aboutTitle: "",
    aboutDescription: "",
    aboutImageUrl: "",
    aboutImagePublicId: "",

    contactTitle: "",
    address: "",
    phone: "",
    openingHours: "",
    googleMapUrl: "",
    mapEmbedUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroFile2, setHeroFile2] = useState<File | null>(null);
  const [heroFile3, setHeroFile3] = useState<File | null>(null);
  const [aboutFile, setAboutFile] = useState<File | null>(null);

  const [heroPreview, setHeroPreview] = useState("");
  const [heroPreview2, setHeroPreview2] = useState("");
  const [heroPreview3, setHeroPreview3] = useState("");
  const [aboutPreview, setAboutPreview] = useState("");

  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    async function fetchSiteContent() {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/site-content`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          setToast({
            open: true,
            message: data.message || "โหลดข้อมูลเว็บไซต์ไม่สำเร็จ",
            type: "error",
          });
          return;
        }

        setForm({
          id: data.id,
          templeName: data.templeName || "",
          templeEnglishName: data.templeEnglishName || "",
          heroTitle: data.heroTitle || "",
          heroDescription: data.heroDescription || "",

          heroImageUrl: data.heroImageUrl || "",
          heroImagePublicId: data.heroImagePublicId || "",

          heroImageUrl2: data.heroImageUrl2 || "",
          heroImagePublicId2: data.heroImagePublicId2 || "",

          heroImageUrl3: data.heroImageUrl3 || "",
          heroImagePublicId3: data.heroImagePublicId3 || "",

          aboutTitle: data.aboutTitle || "",
          aboutDescription: data.aboutDescription || "",
          aboutImageUrl: data.aboutImageUrl || "",
          aboutImagePublicId: data.aboutImagePublicId || "",

          contactTitle: data.contactTitle || "",
          address: data.address || "",
          phone: data.phone || "",
          openingHours: data.openingHours || "",
          googleMapUrl: data.googleMapUrl || "",
          mapEmbedUrl: data.mapEmbedUrl || "",
        });

        setHeroPreview(data.heroImageUrl || "");
        setHeroPreview2(data.heroImageUrl2 || "");
        setHeroPreview3(data.heroImageUrl3 || "");
        setAboutPreview(data.aboutImageUrl || "");
      } catch (error) {
        console.error(error);
        setToast({
          open: true,
          message: "เชื่อมต่อ backend ไม่สำเร็จ",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSiteContent();
  }, [API_URL]);

  useEffect(() => {
    if (!heroFile) return;
    const objectUrl = URL.createObjectURL(heroFile);
    setHeroPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [heroFile]);

  useEffect(() => {
    if (!heroFile2) return;
    const objectUrl = URL.createObjectURL(heroFile2);
    setHeroPreview2(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [heroFile2]);

  useEffect(() => {
    if (!heroFile3) return;
    const objectUrl = URL.createObjectURL(heroFile3);
    setHeroPreview3(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [heroFile3]);

  useEffect(() => {
    if (!aboutFile) return;
    const objectUrl = URL.createObjectURL(aboutFile);
    setAboutPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [aboutFile]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function uploadImage(file: File, endpoint: string) {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "อัปโหลดรูปไม่สำเร็จ");
    }

    return data as { url: string; publicId: string };
  }

  async function handleDeleteImage(type: "hero1" | "hero2" | "hero3" | "about") {
    try {
      setDeletingKey(type);

      let endpoint = "";

      if (type === "hero1") endpoint = "/site-content/hero-image/1";
      if (type === "hero2") endpoint = "/site-content/hero-image/2";
      if (type === "hero3") endpoint = "/site-content/hero-image/3";
      if (type === "about") endpoint = "/site-content/about-image";

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "ลบรูปไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      if (type === "hero1") {
        setForm((prev) => ({
          ...prev,
          heroImageUrl: "",
          heroImagePublicId: "",
        }));
        setHeroPreview("");
        setHeroFile(null);
      }

      if (type === "hero2") {
        setForm((prev) => ({
          ...prev,
          heroImageUrl2: "",
          heroImagePublicId2: "",
        }));
        setHeroPreview2("");
        setHeroFile2(null);
      }

      if (type === "hero3") {
        setForm((prev) => ({
          ...prev,
          heroImageUrl3: "",
          heroImagePublicId3: "",
        }));
        setHeroPreview3("");
        setHeroFile3(null);
      }

      if (type === "about") {
        setForm((prev) => ({
          ...prev,
          aboutImageUrl: "",
          aboutImagePublicId: "",
        }));
        setAboutPreview("");
        setAboutFile(null);
      }

      setToast({
        open: true,
        message: "ลบรูปสำเร็จ",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "เกิดข้อผิดพลาดในการลบรูป",
        type: "error",
      });
    } finally {
      setDeletingKey(null);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      let heroUpload: { url: string; publicId: string } | null = null;
      let heroUpload2: { url: string; publicId: string } | null = null;
      let heroUpload3: { url: string; publicId: string } | null = null;
      let aboutUpload: { url: string; publicId: string } | null = null;

      if (heroFile) {
        setUploadingImage(true);
        heroUpload = await uploadImage(heroFile, "/site-content/upload-hero");
      }

      if (heroFile2) {
        setUploadingImage(true);
        heroUpload2 = await uploadImage(heroFile2, "/site-content/upload-hero");
      }

      if (heroFile3) {
        setUploadingImage(true);
        heroUpload3 = await uploadImage(heroFile3, "/site-content/upload-hero");
      }

      if (aboutFile) {
        setUploadingImage(true);
        aboutUpload = await uploadImage(aboutFile, "/site-content/upload-about");
      }

      const payload = {
        ...form,

        heroImageUrl: heroUpload?.url || form.heroImageUrl,
        heroImagePublicId: heroUpload?.publicId || form.heroImagePublicId,
        deleteOldHeroImage: !!heroUpload,

        heroImageUrl2: heroUpload2?.url || form.heroImageUrl2,
        heroImagePublicId2: heroUpload2?.publicId || form.heroImagePublicId2,
        deleteOldHeroImage2: !!heroUpload2,

        heroImageUrl3: heroUpload3?.url || form.heroImageUrl3,
        heroImagePublicId3: heroUpload3?.publicId || form.heroImagePublicId3,
        deleteOldHeroImage3: !!heroUpload3,

        aboutImageUrl: aboutUpload?.url || form.aboutImageUrl,
        aboutImagePublicId: aboutUpload?.publicId || form.aboutImagePublicId,
        deleteOldAboutImage: !!aboutUpload,
      };

      const res = await fetch(`${API_URL}/site-content`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "บันทึกข้อมูลไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      setForm((prev) => ({
        ...prev,
        ...data,
      }));

      setHeroFile(null);
      setHeroFile2(null);
      setHeroFile3(null);
      setAboutFile(null);

      setHeroPreview(data.heroImageUrl || "");
      setHeroPreview2(data.heroImageUrl2 || "");
      setHeroPreview3(data.heroImageUrl3 || "");
      setAboutPreview(data.aboutImageUrl || "");

      setToast({
        open: true,
        message: "บันทึกข้อมูลเว็บไซต์สำเร็จ",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        type: "error",
      });
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  }

  return (
    <>
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />

      <div className="min-h-screen bg-[#f8f3ea] px-4 py-8 text-[#4a3b22] md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b88a2a]">
              Admin Panel
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#8d6720] md:text-4xl">
              จัดการข้อมูลเว็บไซต์
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b5b3e] md:text-base">
              แก้ไขข้อมูลหลักของเว็บไซต์ เช่น Hero, ประวัติวัด และข้อมูลติดต่อ
            </p>
          </div>

          {loading ? (
            <div className="rounded-[28px] border border-[#ead7b0] bg-white p-10 text-center shadow-sm">
              <div className="flex items-center justify-center gap-3 text-[#6b5b3e]">
                <Loader className="h-5 w-5 animate-spin" />
                <span>กำลังโหลดข้อมูล...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <SectionCard title="ข้อมูลทั่วไป" icon={<Info className="h-5 w-5" />}>
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="ชื่อวัด"
                    name="templeName"
                    value={form.templeName || ""}
                    onChange={handleChange}
                    placeholder="เช่น วัดป่าแก้วมณีนพเก้า"
                  />

                  <InputField
                    label="ชื่อวัดภาษาอังกฤษ"
                    name="templeEnglishName"
                    value={form.templeEnglishName || ""}
                    onChange={handleChange}
                    placeholder="เช่น Wat Pa Kaew Maneenoppakao"
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Hero Section"
                icon={<ImageIcon className="h-5 w-5" />}
              >
                <div className="grid gap-6">
                  <div className="grid gap-5 lg:grid-cols-2">
                    <InputField
                      label="Hero Title"
                      name="heroTitle"
                      value={form.heroTitle || ""}
                      onChange={handleChange}
                      placeholder="หัวข้อส่วน Hero"
                    />

                    <TextareaField
                      label="Hero Description"
                      name="heroDescription"
                      value={form.heroDescription || ""}
                      onChange={handleChange}
                      rows={4}
                      placeholder="คำอธิบายส่วน Hero"
                    />
                  </div>

                  <div className="grid gap-6 xl:grid-cols-3">
                    <UploadBox
                      label="รูป Hero หลัก"
                      file={heroFile}
                      onChange={setHeroFile}
                      preview={heroPreview}
                      placeholder="เลือกไฟล์รูป Hero หลัก"
                      aspectClass="aspect-[4/5] max-h-[420px]"
                      onDelete={() => handleDeleteImage("hero1")}
                      deleting={deletingKey === "hero1"}
                      recommendation={
                        <>
                          <p>
                            แนะนำขนาดรูป{" "}
                            <span className="font-semibold text-[#6b5b3e]">
                              1200 x 1500 px
                            </span>
                          </p>
                          <p>
                            อัตราส่วน{" "}
                            <span className="font-semibold text-[#6b5b3e]">
                              4:5
                            </span>{" "}
                            สำหรับรูปหลักฝั่งซ้าย
                          </p>
                          <p>
                            รองรับไฟล์{" "}
                            <span className="font-semibold text-[#6b5b3e]">
                              JPG, PNG
                            </span>{" "}
                            และไม่ควรเกิน{" "}
                            <span className="font-semibold text-[#6b5b3e]">
                              5MB
                            </span>
                          </p>
                        </>
                      }
                    />

                    <UploadBox
                      label="รูป Hero รอง 1"
                      file={heroFile2}
                      onChange={setHeroFile2}
                      preview={heroPreview2}
                      placeholder="เลือกไฟล์รูป Hero รอง 1"
                      aspectClass="aspect-[4/3] max-h-[320px]"
                      onDelete={() => handleDeleteImage("hero2")}
                      deleting={deletingKey === "hero2"}
                      recommendation={
                        <>
                          <p>
                            แนะนำขนาดรูป{" "}
                            <span className="font-semibold text-[#6b5b3e]">
                              1200 x 900 px
                            </span>
                          </p>
                          <p>
                            อัตราส่วน{" "}
                            <span className="font-semibold text-[#6b5b3e]">
                              4:3
                            </span>{" "}
                            สำหรับรูปย่อยด้านขวา
                          </p>
                          <p>ควรใช้รูปบรรยากาศหรือกิจกรรมในวัด</p>
                        </>
                      }
                    />

                    <UploadBox
                      label="รูป Hero รอง 2"
                      file={heroFile3}
                      onChange={setHeroFile3}
                      preview={heroPreview3}
                      placeholder="เลือกไฟล์รูป Hero รอง 2"
                      aspectClass="aspect-[4/3] max-h-[320px]"
                      onDelete={() => handleDeleteImage("hero3")}
                      deleting={deletingKey === "hero3"}
                      recommendation={
                        <>
                          <p>
                            แนะนำขนาดรูป{" "}
                            <span className="font-semibold text-[#6b5b3e]">
                              1200 x 900 px
                            </span>
                          </p>
                          <p>
                            อัตราส่วน{" "}
                            <span className="font-semibold text-[#6b5b3e]">
                              4:3
                            </span>{" "}
                            เพื่อให้ layout สมดุล
                          </p>
                          <p>ควรใช้โทนภาพใกล้กับรูปหลักเพื่อให้หน้าเว็บดูสวย</p>
                        </>
                      }
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="ประวัติวัด"
                icon={<Info className="h-5 w-5" />}
              >
                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-5">
                    <InputField
                      label="About Title"
                      name="aboutTitle"
                      value={form.aboutTitle || ""}
                      onChange={handleChange}
                      placeholder="หัวข้อประวัติวัด"
                    />

                    <TextareaField
                      label="About Description"
                      name="aboutDescription"
                      value={form.aboutDescription || ""}
                      onChange={handleChange}
                      rows={8}
                      placeholder="รายละเอียดประวัติวัด"
                    />
                  </div>

                  <UploadBox
                    label="รูป About"
                    file={aboutFile}
                    onChange={setAboutFile}
                    preview={aboutPreview}
                    placeholder="เลือกไฟล์รูป About"
                    aspectClass="aspect-[4/3] max-h-[320px]"
                    onDelete={() => handleDeleteImage("about")}
                    deleting={deletingKey === "about"}
                    recommendation={
                      <>
                        <p>
                          แนะนำขนาดรูป{" "}
                          <span className="font-semibold text-[#6b5b3e]">
                            1200 x 900 px
                          </span>
                        </p>
                        <p>
                          อัตราส่วน{" "}
                          <span className="font-semibold text-[#6b5b3e]">
                            4:3
                          </span>{" "}
                          เพื่อให้รูปดูพอดีและไม่ถูกตัดมาก
                        </p>
                        <p>
                          รองรับไฟล์{" "}
                          <span className="font-semibold text-[#6b5b3e]">
                            JPG, PNG
                          </span>{" "}
                          และขนาดไฟล์ไม่ควรเกิน{" "}
                          <span className="font-semibold text-[#6b5b3e]">
                            5MB
                          </span>
                        </p>
                      </>
                    }
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="ข้อมูลติดต่อ"
                icon={<Phone className="h-5 w-5" />}
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <InputField
                      label="Contact Title"
                      name="contactTitle"
                      value={form.contactTitle || ""}
                      onChange={handleChange}
                      placeholder="หัวข้อข้อมูลติดต่อ"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <TextareaField
                      label="ที่อยู่"
                      name="address"
                      value={form.address || ""}
                      onChange={handleChange}
                      rows={3}
                      placeholder="ที่อยู่ของวัด"
                    />
                  </div>

                  <InputField
                    label="เบอร์โทร"
                    name="phone"
                    value={form.phone || ""}
                    onChange={handleChange}
                    placeholder="เช่น 08x-xxx-xxxx"
                  />

                  <InputField
                    label="เวลาเปิดทำการ"
                    name="openingHours"
                    value={form.openingHours || ""}
                    onChange={handleChange}
                    placeholder="เช่น ทุกวัน 08:00 - 17:00"
                  />

                  <InputField
                    label="Google Map URL"
                    name="googleMapUrl"
                    value={form.googleMapUrl || ""}
                    onChange={handleChange}
                    placeholder="ลิงก์ Google Maps"
                  />

                  <InputField
                    label="Map Embed URL"
                    name="mapEmbedUrl"
                    value={form.mapEmbedUrl || ""}
                    onChange={handleChange}
                    placeholder="ลิงก์ Embed แผนที่"
                  />
                </div>
              </SectionCard>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving || uploadingImage}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c9a34e] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#a67c2e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving || uploadingImage ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      {uploadingImage ? "กำลังอัปโหลดรูป..." : "กำลังบันทึก..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      บันทึกข้อมูล
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}