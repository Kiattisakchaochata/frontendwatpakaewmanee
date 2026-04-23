"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Eye,
  EyeOff,
  Loader,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Toast from "@/app/components/ui/Toast";

type ActivityItem = {
  id: string;
  title: string;
  description?: string | null;
  eventDate?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  isUpcoming: boolean;
  isActive: boolean;
  orderNumber: number;
  createdAt: string;
  updatedAt: string;
};

type ActivityForm = {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  isUpcoming: boolean;
  isActive: boolean;
  orderNumber: string;
};

const initialForm: ActivityForm = {
  title: "",
  description: "",
  eventDate: "",
  location: "",
  isUpcoming: true,
  isActive: true,
  orderNumber: "",
};

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-[28px] border border-[#ead7b0] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#8d6720]">
              ยืนยันการลบกิจกรรม
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#6b5b3e]">
              คุณต้องการลบกิจกรรมนี้ใช่หรือไม่?
            </p>
            {title && (
              <p className="mt-3 line-clamp-2 rounded-xl bg-[#f8f3ea] px-3 py-2 text-sm text-[#4a3b22]">
                {title}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#ead7b0] text-[#6b5b3e] transition hover:bg-[#f8f3ea] disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-[#d9c39a] px-4 py-2 text-sm font-semibold text-[#6b5b3e] transition hover:bg-[#f8f3ea] disabled:opacity-50"
          >
            ยกเลิก
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {loading && <Loader className="h-4 w-4 animate-spin" />}
            {loading ? "กำลังลบ..." : "ยืนยันลบ"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityModal({
  open,
  mode,
  form,
  setForm,
  onClose,
  onSubmit,
  loading,
  uploadingImage,
  selectedFile,
  setSelectedFile,
  previewUrl,
}: {
  open: boolean;
  mode: "create" | "edit";
  form: ActivityForm;
  setForm: React.Dispatch<React.SetStateAction<ActivityForm>>;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  uploadingImage: boolean;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  previewUrl: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-[#ead7b0] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b88a2a]">
              Activity
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#8d6720]">
              {mode === "create" ? "เพิ่มกิจกรรม" : "แก้ไขกิจกรรม"}
            </h2>
          </div>

          <button
            onClick={onClose}
            disabled={loading || uploadingImage}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#ead7b0] text-[#6b5b3e] transition hover:bg-[#f8f3ea] disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
              ชื่อกิจกรรม
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-2xl border border-[#d9c39a] bg-white px-4 py-3 text-sm text-[#4a3b22] placeholder:text-[#b9ab8d] caret-[#8d6720] outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
              placeholder="เช่น พิธีทำบุญวันพระใหญ่"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
              วันที่จัดกิจกรรม
            </label>
            <input
              type="datetime-local"
              value={form.eventDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, eventDate: e.target.value }))
              }
              className="w-full rounded-2xl border border-[#d9c39a] bg-white px-4 py-3 text-sm text-[#4a3b22] placeholder:text-[#b9ab8d] caret-[#8d6720] outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
              สถานที่
            </label>
            <input
              value={form.location}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, location: e.target.value }))
              }
              className="w-full rounded-2xl border border-[#d9c39a] bg-white px-4 py-3 text-sm text-[#4a3b22] placeholder:text-[#b9ab8d] caret-[#8d6720] outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
              placeholder="เช่น ศาลาปฏิบัติธรรม"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
              รายละเอียดกิจกรรม
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full rounded-2xl border border-[#d9c39a] bg-white px-4 py-3 text-sm text-[#4a3b22] placeholder:text-[#b9ab8d] caret-[#8d6720] outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
              placeholder="รายละเอียดกิจกรรม"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
              รูปกิจกรรม
            </label>

            <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-[#d9c39a] bg-[#fffaf0] px-4 py-6 text-sm font-medium text-[#8d6720] transition hover:bg-[#fff7e8]">
              <Upload className="h-5 w-5" />
              <span>{selectedFile ? selectedFile.name : "เลือกไฟล์รูปภาพ"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedFile(file);
                }}
              />
            </label>

            <div className="mt-3 rounded-2xl border border-[#ead7b0] bg-[#fffaf0] px-4 py-3 text-xs leading-6 text-[#8a7a5d]">
  <p>รองรับการอัปโหลดรูปกิจกรรมไปยัง Cloudinary</p>
  <p>
    แนะนำขนาดรูป <span className="font-semibold text-[#6b5b3e]">1200 x 1000 px</span>{" "}
    (อัตราส่วน <span className="font-semibold text-[#6b5b3e]">6:5</span>)
  </p>
  <p>
    รองรับไฟล์ <span className="font-semibold text-[#6b5b3e]">JPG, PNG</span>{" "}
    และขนาดไฟล์ไม่ควรเกิน{" "}
    <span className="font-semibold text-[#6b5b3e]">5MB</span>
  </p>
</div>
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
                setForm((prev) => ({ ...prev, orderNumber: e.target.value }))
              }
              className="w-full rounded-2xl border border-[#d9c39a] bg-white px-4 py-3 text-sm text-[#4a3b22] placeholder:text-[#b9ab8d] caret-[#8d6720] outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
              placeholder="เช่น 1"
            />
          </div>

          <div className="flex flex-col justify-end gap-3 rounded-2xl border border-[#ead7b0] bg-[#fffaf0] p-4">
            <label className="flex items-center gap-3 text-sm font-medium text-[#4a3b22]">
              <input
                type="checkbox"
                checked={form.isUpcoming}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isUpcoming: e.target.checked }))
                }
              />
              เป็นกิจกรรมที่กำลังจะจัด
            </label>

            <label className="flex items-center gap-3 text-sm font-medium text-[#4a3b22]">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
              />
              เปิดใช้งานการแสดงผล
            </label>
          </div>
        </div>

        {previewUrl && (
          <div className="mt-5 overflow-hidden rounded-[24px] border border-[#ead7b0] bg-[#fffaf0] p-3">
            <div className="aspect-[16/10] overflow-hidden rounded-[18px] bg-white">
              <img
                src={previewUrl}
                alt={form.title || "preview"}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading || uploadingImage}
            className="rounded-2xl border border-[#d9c39a] px-5 py-3 text-sm font-semibold text-[#6b5b3e] transition hover:bg-[#f8f3ea] disabled:opacity-50"
          >
            ยกเลิก
          </button>

          <button
            onClick={onSubmit}
            disabled={loading || uploadingImage}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c9a34e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a67c2e] disabled:opacity-60"
          >
            {loading || uploadingImage ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                {uploadingImage ? "กำลังอัปโหลดรูป..." : "กำลังบันทึก..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {mode === "create" ? "เพิ่มกิจกรรม" : "บันทึกการแก้ไข"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminActivityPage() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "/api";

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [form, setForm] = useState<ActivityForm>(initialForm);
  const [editingItem, setEditingItem] = useState<ActivityItem | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ActivityItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    if (!selectedFile) {
      setLocalPreview(editingItem?.imageUrl || "");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setLocalPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, editingItem]);

  async function fetchActivities() {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/activity`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "โหลดกิจกรรมไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      setActivities(data);
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

  useEffect(() => {
    fetchActivities();
  }, []);

  function isPastActivity(item: ActivityItem) {
    if (!item.eventDate) {
      return !item.isUpcoming;
    }

    const eventTime = new Date(item.eventDate).getTime();
    const now = Date.now();

    return eventTime < now;
  }

  const upcomingActivities = useMemo(() => {
    return activities
      .filter((item) => !isPastActivity(item))
      .sort((a, b) => {
        const aTime = a.eventDate ? new Date(a.eventDate).getTime() : Infinity;
        const bTime = b.eventDate ? new Date(b.eventDate).getTime() : Infinity;
        return aTime - bTime;
      });
  }, [activities]);

  const pastActivities = useMemo(() => {
    return activities
      .filter((item) => isPastActivity(item))
      .sort((a, b) => {
        const aTime = a.eventDate ? new Date(a.eventDate).getTime() : 0;
        const bTime = b.eventDate ? new Date(b.eventDate).getTime() : 0;
        return bTime - aTime;
      });
  }, [activities]);

  function openCreateModal() {
    setModalMode("create");
    setEditingItem(null);
    setForm(initialForm);
    setSelectedFile(null);
    setLocalPreview("");
    setModalOpen(true);
  }

  function openEditModal(activity: ActivityItem) {
    setModalMode("edit");
    setEditingItem(activity);
    setForm({
      title: activity.title || "",
      description: activity.description || "",
      eventDate: activity.eventDate
        ? new Date(activity.eventDate).toISOString().slice(0, 16)
        : "",
      location: activity.location || "",
      isUpcoming: activity.isUpcoming,
      isActive: activity.isActive,
      orderNumber: String(activity.orderNumber ?? ""),
    });
    setSelectedFile(null);
    setLocalPreview(activity.imageUrl || "");
    setModalOpen(true);
  }

  async function uploadFileToCloudinary() {
    if (!selectedFile) return null;

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch(`${API_URL}/activity/upload`, {
        method: "POST",
        body: formData,
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

  async function handleSubmit() {
    if (!form.title.trim()) {
      setToast({
        open: true,
        message: "กรุณาระบุชื่อกิจกรรม",
        type: "error",
      });
      return;
    }

    try {
      setSaving(true);

      let uploaded: { url: string; publicId: string } | null = null;

      if (selectedFile) {
        uploaded = await uploadFileToCloudinary();
      }

      if (modalMode === "create" && !uploaded) {
        setToast({
          open: true,
          message: "กรุณาเลือกรูปกิจกรรมก่อนบันทึก",
          type: "error",
        });
        return;
      }

      const payload = {
        title: form.title,
        description: form.description || null,
        eventDate: form.eventDate ? new Date(form.eventDate).toISOString() : null,
        location: form.location || null,
        imageUrl: uploaded?.url ?? editingItem?.imageUrl ?? null,
        imagePublicId: uploaded?.publicId ?? editingItem?.imagePublicId ?? null,
        isUpcoming: form.isUpcoming,
        isActive: form.isActive,
        orderNumber:
          form.orderNumber === "" ? undefined : Number(form.orderNumber),
        deleteOldImage: !!uploaded && modalMode === "edit",
      };

      const url =
        modalMode === "create"
          ? `${API_URL}/activity`
          : `${API_URL}/activity/${editingItem?.id}`;

      const method = modalMode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "บันทึกกิจกรรมไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      setToast({
        open: true,
        message:
          modalMode === "create"
            ? "เพิ่มกิจกรรมสำเร็จ"
            : "แก้ไขกิจกรรมสำเร็จ",
        type: "success",
      });

      setModalOpen(false);
      setForm(initialForm);
      setEditingItem(null);
      setSelectedFile(null);
      setLocalPreview("");
      await fetchActivities();
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "เกิดข้อผิดพลาดในการบันทึกกิจกรรม",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string) {
    try {
      setTogglingId(id);

      const res = await fetch(`${API_URL}/activity/${id}/toggle`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "เปลี่ยนสถานะกิจกรรมไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      setToast({
        open: true,
        message: "เปลี่ยนสถานะกิจกรรมสำเร็จ",
        type: "success",
      });

      await fetchActivities();
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะกิจกรรม",
        type: "error",
      });
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget.id);

      const res = await fetch(`${API_URL}/activity/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "ลบกิจกรรมไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      setToast({
        open: true,
        message: "ลบกิจกรรมสำเร็จ",
        type: "success",
      });

      setDeleteTarget(null);
      await fetchActivities();
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "เกิดข้อผิดพลาดในการลบกิจกรรม",
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  }

  function renderActivityCard(activity: ActivityItem) {
    return (
      <div
        key={activity.id}
        className="overflow-hidden rounded-[28px] border border-[#ead7b0] bg-white shadow-[0_10px_30px_rgba(166,124,46,0.08)]"
      >
        <div className="relative">
          <div className="aspect-[6/5] overflow-hidden bg-[#f6efe2]">
            {activity.imageUrl ? (
              <img
                src={activity.imageUrl}
                alt={activity.title}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[#6b5b3e]">
                ไม่มีรูปกิจกรรม
              </div>
            )}
          </div>

          <div
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm ${
              isPastActivity(activity) ? "bg-[#8a7a5d]" : "bg-[#c9a34e]"
            }`}
          >
            {isPastActivity(activity) ? "กิจกรรมที่ผ่านมา" : "กำลังจะจัด"}
          </div>
        </div>

        <div className="p-3.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold leading-6 text-[#4a3b22]">
              {activity.title}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                activity.isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {activity.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
            </span>
          </div>

          {activity.eventDate && (
            <div className="mt-2 flex items-center gap-2 text-sm text-[#8a7a5d]">
              <CalendarDays className="h-4 w-4" />
              <span>{new Date(activity.eventDate).toLocaleString("th-TH")}</span>
            </div>
          )}

          {activity.location && (
            <p className="mt-2 text-sm leading-6 text-[#6b5b3e]">
              สถานที่: {activity.location}
            </p>
          )}

          {activity.description && (
            <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-[#6b5b3e]">
              {activity.description}
            </p>
          )}

          <div className="mt-4 text-xs text-[#8a7a5d]">
            ลำดับการแสดง:{" "}
            <span className="font-semibold">{activity.orderNumber}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => openEditModal(activity)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d9c39a] px-3 py-2 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
            >
              <Pencil className="h-4 w-4" />
              แก้ไข
            </button>

            <button
              onClick={() => handleToggle(activity.id)}
              disabled={togglingId === activity.id}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition disabled:opacity-60 ${
                activity.isActive
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "border-green-200 text-green-700 hover:bg-green-50"
              }`}
            >
              {togglingId === activity.id ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : activity.isActive ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {activity.isActive ? "ปิดใช้งาน" : "เปิดใช้งาน"}
            </button>

            <button
              onClick={() => setDeleteTarget(activity)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              ลบ
            </button>
          </div>
        </div>
      </div>
    );
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

      <ActivityModal
        open={modalOpen}
        mode={modalMode}
        form={form}
        setForm={setForm}
        onClose={() => {
          if (!saving && !uploadingImage) {
            setModalOpen(false);
            setEditingItem(null);
            setForm(initialForm);
            setSelectedFile(null);
            setLocalPreview("");
          }
        }}
        onSubmit={handleSubmit}
        loading={saving}
        uploadingImage={uploadingImage}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        previewUrl={localPreview}
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        title={deleteTarget?.title}
        onClose={() => {
          if (!deletingId) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        loading={!!deletingId}
      />

      <div className="min-h-screen bg-[#f8f3ea] px-4 py-8 text-[#4a3b22] md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b88a2a]">
                Admin Panel
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#8d6720] md:text-4xl">
                จัดการกิจกรรมของวัด
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b5b3e] md:text-base">
                เพิ่ม แก้ไข ลบ จัดลำดับ และเปิด/ปิดการแสดงผลของกิจกรรม
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c9a34e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a67c2e]"
            >
              <Plus className="h-4 w-4" />
              เพิ่มกิจกรรม
            </button>
          </div>

          {loading ? (
            <div className="rounded-[28px] border border-[#ead7b0] bg-white p-10 text-center shadow-sm">
              <div className="flex items-center justify-center gap-3 text-[#6b5b3e]">
                <Loader className="h-5 w-5 animate-spin" />
                <span>กำลังโหลดกิจกรรม...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <section>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-[#8d6720]">
                    กิจกรรมที่กำลังจะจัด
                  </h2>
                  <p className="mt-1 text-sm text-[#6b5b3e]">
                    ทั้งหมด {upcomingActivities.length} รายการ
                  </p>
                </div>

                {upcomingActivities.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-[#d9c39a] bg-white p-8 text-center text-[#6b5b3e] shadow-sm">
                    ยังไม่มีกิจกรรมที่กำลังจะจัด
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {upcomingActivities.map(renderActivityCard)}
                  </div>
                )}
              </section>

              <section>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-[#8d6720]">
                    กิจกรรมที่ผ่านมา
                  </h2>
                  <p className="mt-1 text-sm text-[#6b5b3e]">
                    ทั้งหมด {pastActivities.length} รายการ
                  </p>
                </div>

                {pastActivities.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-[#d9c39a] bg-white p-8 text-center text-[#6b5b3e] shadow-sm">
                    ยังไม่มีกิจกรรมที่ผ่านมา
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {pastActivities.map(renderActivityCard)}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
}