"use client";

import { useEffect, useMemo, useState } from "react";
import Toast from "@/app/components/ui/Toast";
import {
  BookOpen,
  Eye,
  EyeOff,
  Loader,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type Sermon = {
  id: string;
  title: string;
  speaker?: string | null;
  description?: string | null;
  content?: string | null;
  coverImage?: string | null;
  coverPublicId?: string | null;
  videoUrl?: string | null;
  tiktokUrl?: string | null;
  isActive: boolean;
  orderNumber: number;
  createdAt?: string;
  updatedAt?: string;
};

type SermonForm = {
  title: string;
  speaker: string;
  description: string;
  content: string;
  coverImage: string;
  coverPublicId: string;
  videoUrl: string;
  tiktokUrl: string;
  isActive: boolean;
  orderNumber: string;
};

const initialForm: SermonForm = {
  title: "",
  speaker: "",
  description: "",
  content: "",
  coverImage: "",
  coverPublicId: "",
  videoUrl: "",
  tiktokUrl: "",
  isActive: true,
  orderNumber: "",
};

function LoadingOverlay({
  open,
  text = "กำลังดำเนินการ...",
}: {
  open: boolean;
  text?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-4 rounded-[24px] bg-white px-8 py-7 shadow-2xl">
        <Loader className="h-14 w-14 animate-spin text-[#c9a34e]" />
        <p className="text-sm font-medium text-[#4a3b22]">{text}</p>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  open,
  title,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[3px]">
      <div className="w-full max-w-lg rounded-[32px] border border-[#ead7b0] bg-white p-6 shadow-2xl md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b88a2a]">
              Delete Sermon
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#8d6720]">
              ยืนยันการลบธรรมเทศนา
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#6b5b3e]">
              คุณต้องการลบรายการนี้ใช่หรือไม่? เมื่อลบแล้วจะไม่สามารถเรียกคืนได้
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ead7b0] text-[#6b5b3e] transition hover:bg-[#f8f3ea] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {title && (
          <div className="mt-5 rounded-2xl border border-[#ead7b0] bg-gradient-to-r from-[#fbf7ef] to-[#f6efe2] px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
              ชื่อหัวข้อ
            </p>
            <p className="mt-1 line-clamp-2 text-base font-semibold leading-7 text-[#4a3b22]">
              {title}
            </p>
          </div>
        )}

        <div className="mt-7 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl border border-[#d9c39a] px-5 py-3 text-sm font-semibold text-[#6b5b3e] transition hover:bg-[#f8f3ea] disabled:opacity-50"
          >
            ยกเลิก
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {loading && <Loader className="h-4 w-4 animate-spin" />}
            {loading ? "กำลังลบ..." : "ยืนยันลบ"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSermonPage() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

  const [list, setList] = useState<Sermon[]>([]);
  const [editing, setEditing] = useState<Sermon | null>(null);
  const [form, setForm] = useState<SermonForm>(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("กำลังดำเนินการ...");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Sermon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [orderMap, setOrderMap] = useState<Record<string, number>>({});

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({
    open: false,
    message: "",
    type: "success",
  });

  async function load() {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/sermon`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "โหลดข้อมูลธรรมเทศนาไม่สำเร็จ");
      }

      const safeData = Array.isArray(data) ? data : [];

      const sorted = [...safeData].sort(
        (a, b) =>
          (a.orderNumber ?? 0) - (b.orderNumber ?? 0) ||
          new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
      );

      setList(sorted);

      const nextOrderMap: Record<string, number> = {};
      sorted.forEach((item: Sermon) => {
        nextOrderMap[item.id] = item.orderNumber ?? 0;
      });
      setOrderMap(nextOrderMap);
    } catch (error) {
      console.error("โหลด sermon ไม่สำเร็จ", error);
      setToast({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "โหลดข้อมูลธรรมเทศนาไม่สำเร็จ",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [API_URL]);

  useEffect(() => {
    if (!file) {
      setPreview(editing?.coverImage || form.coverImage || "");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, editing, form.coverImage]);

  const filteredList = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return list;

    return list.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const speaker = item.speaker?.toLowerCase() || "";
      const tiktokUrl = item.tiktokUrl?.toLowerCase() || "";
      const videoUrl = item.videoUrl?.toLowerCase() || "";

      return (
        title.includes(keyword) ||
        speaker.includes(keyword) ||
        tiktokUrl.includes(keyword) ||
        videoUrl.includes(keyword)
      );
    });
  }, [list, searchTerm]);

  async function uploadImage() {
    if (!file) return null;

    try {
      setUploadingImage(true);

      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch(`${API_URL}/sermon/upload`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "อัปโหลดรูปไม่สำเร็จ");
      }

      return data as { url: string; publicId: string };
    } finally {
      setUploadingImage(false);
    }
  }

  async function createCoverFromTiktok() {
    if (!form.tiktokUrl.trim()) return null;

    const res = await fetch(`${API_URL}/sermon/tiktok-cover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tiktokUrl: form.tiktokUrl.trim(),
        title: form.title.trim() || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "ดึงรูปปกจาก TikTok ไม่สำเร็จ");
    }

    return data as { url: string; publicId: string };
  }

  function openCreate() {
    setEditing(null);
    setForm(initialForm);
    setFile(null);
    setPreview("");
  }

  function openEdit(item: Sermon) {
    setEditing(item);
    setForm({
      title: item.title || "",
      speaker: item.speaker || "",
      description: item.description || "",
      content: item.content || "",
      coverImage: item.coverImage || "",
      coverPublicId: item.coverPublicId || "",
      videoUrl: item.videoUrl || "",
      tiktokUrl: item.tiktokUrl || "",
      isActive: item.isActive,
      orderNumber: String(item.orderNumber ?? 0),
    });
    setFile(null);
    setPreview(item.coverImage || "");
  }

  async function handleSave() {
    try {
      if (!form.title.trim()) {
        setToast({
          open: true,
          message: "กรุณากรอกชื่อหัวข้อ",
          type: "error",
        });
        return;
      }

      setSaving(true);
      setActionLoading(true);
      setLoadingText(
        editing ? "กำลังบันทึกการแก้ไข..." : "กำลังเพิ่มธรรมเทศนา..."
      );

      let uploaded: { url: string; publicId: string } | null = null;

      if (file) {
        setLoadingText("กำลังอัปโหลดรูป...");
        uploaded = await uploadImage();
      } else {
        const oldTiktokUrl = (editing?.tiktokUrl || "").trim();
        const newTiktokUrl = form.tiktokUrl.trim();

        const tiktokChanged = !!newTiktokUrl && newTiktokUrl !== oldTiktokUrl;
        const shouldCreateCoverFromTiktok =
          !!newTiktokUrl && (!form.coverImage || tiktokChanged);

        if (shouldCreateCoverFromTiktok) {
          setLoadingText("กำลังดึงรูปปกจาก TikTok...");
          uploaded = await createCoverFromTiktok();
        }
      }

      const payload = {
  title: form.title,
  speaker: form.speaker || null,
  description: form.description || null,
  content: form.content || null,
  coverImage: uploaded?.url || form.coverImage || null,
  coverPublicId: uploaded?.publicId || form.coverPublicId || null,
  videoUrl: form.videoUrl || null,
  tiktokUrl: form.tiktokUrl || null,
  isActive: form.isActive,
  orderNumber:
    form.orderNumber.trim() === "" ? undefined : Number(form.orderNumber),
  deleteOldCoverImage: !!uploaded && !!editing?.coverPublicId,
};

      const url = editing
        ? `${API_URL}/sermon/${editing.id}`
        : `${API_URL}/sermon`;

      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "บันทึกข้อมูลไม่สำเร็จ");
      }

      setToast({
        open: true,
        message: editing ? "บันทึกการแก้ไขสำเร็จ" : "เพิ่มธรรมเทศนาสำเร็จ",
        type: "success",
      });

      openCreate();
      await load();
    } catch (error) {
      console.error("บันทึก sermon ไม่สำเร็จ", error);
      setToast({
        open: true,
        message:
          error instanceof Error ? error.message : "บันทึกข้อมูลไม่สำเร็จ",
        type: "error",
      });
    } finally {
      setSaving(false);
      setActionLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);
      setActionLoading(true);
      setLoadingText("กำลังลบธรรมเทศนา...");

      const res = await fetch(`${API_URL}/sermon/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "ลบไม่สำเร็จ");
      }

      setToast({
        open: true,
        message: "ลบธรรมเทศนาสำเร็จ",
        type: "success",
      });

      setDeleteTarget(null);
      await load();
    } catch (error) {
      console.error("ลบ sermon ไม่สำเร็จ", error);
      setToast({
        open: true,
        message: error instanceof Error ? error.message : "ลบข้อมูลไม่สำเร็จ",
        type: "error",
      });
    } finally {
      setDeletingId(null);
      setActionLoading(false);
    }
  }

  async function handleToggle(id: string) {
    try {
      setTogglingId(id);

      const res = await fetch(`${API_URL}/sermon/${id}/toggle`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "เปลี่ยนสถานะไม่สำเร็จ");
      }

      setToast({
        open: true,
        message: "เปลี่ยนสถานะธรรมเทศนาสำเร็จ",
        type: "success",
      });

      await load();
    } catch (error) {
      console.error("toggle sermon ไม่สำเร็จ", error);
      setToast({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "เปลี่ยนสถานะข้อมูลไม่สำเร็จ",
        type: "error",
      });
    } finally {
      setTogglingId(null);
    }
  }

  async function handleSaveOrder(id: string) {
    const nextOrder = Number(orderMap[id] ?? 0);

    if (Number.isNaN(nextOrder) || nextOrder < 0) {
      setToast({
        open: true,
        message: "ลำดับการแสดงไม่ถูกต้อง",
        type: "error",
      });
      return;
    }

    const duplicated = list.find(
      (item) => item.id !== id && Number(item.orderNumber) === nextOrder
    );

    if (duplicated) {
      setToast({
        open: true,
        message: `ลำดับ ${nextOrder} ถูกใช้งานแล้ว`,
        type: "error",
      });
      return;
    }

    try {
      setSavingOrderId(id);

      const target = list.find((item) => item.id === id);
      if (!target) return;

      const res = await fetch(`${API_URL}/sermon/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: target.title,
          speaker: target.speaker || null,
          description: target.description || null,
          content: target.content || null,
          coverImage: target.coverImage || null,
          coverPublicId: target.coverPublicId || null,
          videoUrl: target.videoUrl || null,
          tiktokUrl: target.tiktokUrl || null,
          isActive: target.isActive,
          orderNumber: nextOrder,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "บันทึกลำดับไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      setToast({
        open: true,
        message: "บันทึกลำดับสำเร็จ",
        type: "success",
      });

      await load();
    } catch (error) {
      setToast({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "เกิดข้อผิดพลาดในการบันทึกลำดับ",
        type: "error",
      });
    } finally {
      setSavingOrderId(null);
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

      <LoadingOverlay open={actionLoading} text={loadingText} />

      <DeleteConfirmModal
        open={!!deleteTarget}
        title={deleteTarget?.title}
        onClose={() => {
          if (!deletingId) setDeleteTarget(null);
        }}
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget.id);
        }}
        loading={!!deletingId}
      />

      <div className="min-h-screen bg-[#f8f3ea] px-4 py-8 text-[#4a3b22] md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[#ead7b0] bg-white px-4 py-2 text-sm font-semibold text-[#8d6720] shadow-sm">
                <BookOpen className="h-4 w-4" />
                Sermon Management
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#8d6720] md:text-4xl">
                จัดการธรรมเทศนา
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b5b3e] md:text-base">
                เพิ่ม แก้ไข ลบ เปิด/ปิดการแสดงผล และใส่ลิงก์วิดีโอ TikTok /
                YouTube ได้
              </p>
            </div>

            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c9a34e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a67c2e]"
            >
              <Plus className="h-4 w-4" />
              เพิ่มธรรมเทศนาใหม่
            </button>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
  <div className="self-start rounded-[28px] border border-[#ead7b0] bg-white p-6 shadow-[0_10px_30px_rgba(166,124,46,0.08)]">
              <h2 className="text-xl font-bold text-[#8d6720]">
                {editing ? "แก้ไขธรรมเทศนา" : "เพิ่มธรรมเทศนา"}
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                    ชื่อหัวข้อ
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="ชื่อหัวข้อธรรมเทศนา"
                    className="w-full rounded-2xl border border-[#d9c39a] px-4 py-3 text-sm outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                    ผู้บรรยาย
                  </label>
                  <input
                    value={form.speaker}
                    onChange={(e) =>
                      setForm({ ...form, speaker: e.target.value })
                    }
                    placeholder="เช่น พระอาจารย์ประจำวัด"
                    className="w-full rounded-2xl border border-[#d9c39a] px-4 py-3 text-sm outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                    คำอธิบายสั้น
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="คำอธิบายสั้นของธรรมเทศนา"
                    className="w-full rounded-2xl border border-[#d9c39a] px-4 py-3 text-sm outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                    เนื้อหาเต็ม
                  </label>
                  <textarea
                    rows={5}
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    placeholder="เนื้อหาธรรมเทศนา"
                    className="w-full rounded-2xl border border-[#d9c39a] px-4 py-3 text-sm outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                    ลิงก์ TikTok
                  </label>
                  <input
                    value={form.tiktokUrl}
                    onChange={(e) =>
                      setForm({ ...form, tiktokUrl: e.target.value })
                    }
                    placeholder="https://www.tiktok.com/@user/video/..."
                    className="w-full rounded-2xl border border-[#d9c39a] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                  />
                  <p className="mt-2 text-xs text-[#8a7a5d]">
                    ถ้าไม่ได้อัปโหลดรูปเอง ระบบจะดึงรูปปกจาก TikTok และอัปโหลดขึ้น
                    Cloudinary ให้อัตโนมัติ
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                    ลิงก์วิดีโอทั่วไป / YouTube
                  </label>
                  <input
                    value={form.videoUrl}
                    onChange={(e) =>
                      setForm({ ...form, videoUrl: e.target.value })
                    }
                    placeholder="https://youtube.com/... หรือวิดีโออื่น ๆ"
                    className="w-full rounded-2xl border border-[#d9c39a] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                    ลำดับการแสดง
                  </label>
                  <input
  type="number"
  min={0}
  value={form.orderNumber}
  onChange={(e) =>
    setForm({ ...form, orderNumber: e.target.value })
  }
  placeholder="เว้นว่างเพื่อให้ระบบจัดลำดับอัตโนมัติ"
  className="w-full rounded-2xl border border-[#d9c39a] px-4 py-3 text-sm text-[#4a3b22] placeholder:text-[#b7ab92] outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
/>
                </div>

                <div>
  <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
    รูปภาพปก
  </label>

  <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-[#d9c39a] bg-[#fffaf0] px-4 py-6 text-sm font-medium text-[#8d6720] transition hover:bg-[#fff7e8]">
    <Upload className="h-5 w-5" />
    <span>{file ? file.name : "เลือกไฟล์รูปภาพปก"}</span>
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
    />
  </label>

  <div className="mt-3 rounded-2xl border border-[#ead7b0] bg-[#fffaf0] px-4 py-3 text-xs leading-6 text-[#8a7a5d]">
    <p>รองรับการอัปโหลดรูปภาพปกไปยัง Cloudinary</p>
    <p>
      แนะนำขนาดรูป{" "}
      <span className="font-semibold text-[#6b5b3e]">1200 x 675 px</span>{" "}
      (อัตราส่วน{" "}
      <span className="font-semibold text-[#6b5b3e]">16:9</span>)
    </p>
    <p>
      รองรับไฟล์{" "}
      <span className="font-semibold text-[#6b5b3e]">JPG, PNG</span>{" "}
      และขนาดไฟล์ไม่ควรเกิน{" "}
      <span className="font-semibold text-[#6b5b3e]">5MB</span>
    </p>
    <p>
      ถ้าไม่ได้อัปโหลดรูปเอง ระบบจะดึงรูปปกจาก TikTok และอัปโหลดขึ้น
      Cloudinary ให้อัตโนมัติ
    </p>
  </div>
</div>

                {preview && (
                  <div className="overflow-hidden rounded-[24px] border border-[#ead7b0] bg-[#fffaf0] p-3">
                    <img
                      src={preview}
                      alt="preview"
                      className="h-[220px] w-full rounded-[18px] object-cover"
                    />
                  </div>
                )}

                <label className="flex items-center gap-3 text-sm font-medium text-[#4a3b22]">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                  />
                  เปิดใช้งาน
                </label>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving || uploadingImage}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c9a34e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a67c2e] disabled:opacity-60"
                  >
                    {saving || uploadingImage ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        {uploadingImage
                          ? "กำลังอัปโหลดรูป..."
                          : "กำลังบันทึก..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {editing ? "บันทึกการแก้ไข" : "เพิ่มธรรมเทศนา"}
                      </>
                    )}
                  </button>

                  {editing && (
                    <button
                      onClick={openCreate}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d9c39a] px-5 py-3 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
                    >
                      <X className="h-4 w-4" />
                      ยกเลิก
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="self-start xl:pl-2">
  <div className="mb-6 rounded-[24px] border border-[#ead7b0] bg-white p-4 shadow-[0_8px_24px_rgba(166,124,46,0.06)]">
                <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                  ค้นหาธรรมเทศนา
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7a5d]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหาจากชื่อหัวข้อ ผู้บรรยาย หรือลิงก์วิดีโอ"
                    className="w-full rounded-2xl border border-[#d9c39a] bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                  />
                </div>
              </div>

              {loading ? (
                <div className="rounded-[28px] border border-[#ead7b0] bg-white p-10 text-center shadow-sm">
                  <div className="flex items-center justify-center gap-3 text-[#6b5b3e]">
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>กำลังโหลดธรรมเทศนา...</span>
                  </div>
                </div>
              ) : filteredList.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-[#d9c39a] bg-white p-10 text-center text-[#6b5b3e] shadow-sm">
                  ยังไม่มีข้อมูลธรรมเทศนา
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {filteredList.map((item) => (
                    <div
  key={item.id}
  className="overflow-hidden rounded-[24px] border border-[#ead7b0] bg-white shadow-[0_8px_24px_rgba(166,124,46,0.07)] transition hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(166,124,46,0.12)]"
>
                      <div className="relative overflow-hidden">
                        <div className="h-[190px] w-full overflow-hidden bg-[#f6efe2]">
                          {item.coverImage ? (
                            <img
                              src={item.coverImage}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm text-[#8a7a5d]">
                              ไม่มีรูปภาพ
                            </div>
                          )}
                        </div>

                        <div className="absolute left-4 top-4 rounded-full bg-[#c9a34e] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                          ลำดับ {item.orderNumber}
                        </div>

                        <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#4a3b22] shadow-sm">
                          {item.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
                          {item.speaker || "ไม่ระบุผู้บรรยาย"}
                        </p>

                        <h3 className="mt-2 text-lg font-bold leading-7 text-[#4a3b22]">
                          {item.title}
                        </h3>

                        <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-[#6b5b3e]">
                          {item.description || item.content || "-"}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tiktokUrl && (
                            <a
                              href={item.tiktokUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center rounded-2xl border border-[#d9c39a] bg-white px-4 py-2 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
                            >
                              ดู TikTok
                            </a>
                          )}

                          {item.videoUrl && (
                            <a
                              href={item.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center rounded-2xl border border-[#d9c39a] bg-white px-4 py-2 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
                            >
                              ดูวิดีโอ
                            </a>
                          )}
                        </div>

                        <div className="mt-4">
                          <label className="mb-1 block text-[11px] font-semibold text-[#6b5b3e]">
                            ลำดับการแสดง
                          </label>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              value={orderMap[item.id] ?? 0}
                              onChange={(e) =>
                                setOrderMap((prev) => ({
                                  ...prev,
                                  [item.id]: Number(e.target.value),
                                }))
                              }
                              className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                                list.some(
                                  (row) =>
                                    row.id !== item.id &&
                                    Number(row.orderNumber) ===
                                      Number(orderMap[item.id] ?? 0)
                                )
                                  ? "border border-red-300 focus:border-red-400 focus:ring-red-100"
                                  : "border border-[#d9c39a] focus:border-[#c9a34e] focus:ring-[#f3e4bc]"
                              }`}
                            />

                            <button
                              onClick={() => handleSaveOrder(item.id)}
                              disabled={savingOrderId === item.id}
                              title="บันทึกลำดับ"
                              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d9c39a] text-[#8d6720] transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {savingOrderId === item.id ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          {list.some(
                            (row) =>
                              row.id !== item.id &&
                              Number(row.orderNumber) ===
                                Number(orderMap[item.id] ?? 0)
                          ) && (
                            <p className="mt-1 text-[11px] text-red-500">
                              ลำดับนี้ถูกใช้งานแล้ว
                            </p>
                          )}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d9c39a] px-3 py-2 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
                          >
                            <Pencil className="h-4 w-4" />
                            แก้ไข
                          </button>

                          <button
                            onClick={() => handleToggle(item.id)}
                            disabled={togglingId === item.id}
                            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition disabled:opacity-60 ${
                              item.isActive
                                ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                                : "border-green-200 text-green-700 hover:bg-green-50"
                            }`}
                          >
                            {togglingId === item.id ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : item.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            {item.isActive ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                          </button>

                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            ลบ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}