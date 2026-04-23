"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  ImagePlus,
  Loader,
  Pencil,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Toast from "@/app/components/ui/Toast";

type GalleryItem = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  publicId?: string | null;
  orderNumber: number;
  isActive: boolean;
  showInHome?: boolean;
  showInAbout?: boolean;
  showInGallery?: boolean;
  showInHero?: boolean;
  createdAt: string;
  updatedAt: string;
};

type GalleryForm = {
  title: string;
  description: string;
  orderNumber: string;
  isActive: boolean;
  showInHome: boolean;
  showInAbout: boolean;
  showInGallery: boolean;
  showInHero: boolean;
};

const initialForm: GalleryForm = {
  title: "",
  description: "",
  orderNumber: "",
  isActive: true,
  showInHome: false,
  showInAbout: false,
  showInGallery: true,
  showInHero: false,
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
            <h3 className="text-xl font-bold text-[#8d6720]">ยืนยันการลบรูปภาพ</h3>
            <p className="mt-2 text-sm leading-6 text-[#6b5b3e]">
              คุณต้องการลบรูปภาพนี้ใช่หรือไม่?
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

function GalleryModal({
  open,
  mode,
  form,
  setForm,
  onClose,
  onSubmit,
  saving,
  selectedFile,
  setSelectedFile,
  previewUrl,
  uploadingImage,
}: {
  open: boolean;
  mode: "create" | "edit";
  form: GalleryForm;
  setForm: React.Dispatch<React.SetStateAction<GalleryForm>>;
  onClose: () => void;
  onSubmit: () => void;
  saving: boolean;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  previewUrl: string;
  uploadingImage: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-[#ead7b0] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b88a2a]">
              Gallery
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#8d6720]">
              {mode === "create" ? "เพิ่มรูปภาพ" : "แก้ไขรูปภาพ"}
            </h2>
          </div>

          <button
            onClick={onClose}
            disabled={saving || uploadingImage}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#ead7b0] text-[#6b5b3e] transition hover:bg-[#f8f3ea] disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
              ชื่อรูปภาพ
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-2xl border border-[#d9c39a] bg-white px-4 py-3 text-sm text-[#4a3b22] placeholder:text-[#b9ab8d] caret-[#8d6720] outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
              placeholder="เช่น บรรยากาศภายในวัด"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
              รายละเอียด
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full rounded-2xl border border-[#d9c39a] bg-white px-4 py-3 text-sm text-[#4a3b22] placeholder:text-[#b9ab8d] caret-[#8d6720] outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
              placeholder="รายละเอียดรูปภาพ"
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
                setForm((prev) => ({ ...prev, orderNumber: e.target.value }))
              }
              className="w-full rounded-2xl border border-[#d9c39a] bg-white px-4 py-3 text-sm text-[#4a3b22] placeholder:text-[#b9ab8d] caret-[#8d6720] outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
              placeholder="เช่น 1"
            />
          </div>

          <div className="flex items-center rounded-2xl border border-[#ead7b0] bg-[#fffaf0] px-4 py-3">
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

          <div className="md:col-span-2">
  <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
    อัปโหลดรูปภาพ
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

  <div className="mt-2 space-y-1 text-xs text-[#8a7a5d]">
    <p>
      แนะนำขนาดรูปสำหรับการ์ดบนเว็บไซต์: <span className="font-semibold text-[#8d6720]">1200 x 900 px</span>
    </p>
    <p>
      ควรใช้รูปอัตราส่วน <span className="font-semibold text-[#8d6720]">4:3</span> เพื่อให้แสดงพอดีกับการ์ดและไม่ถูกครอปมากเกินไป
    </p>
    <p>
      ถ้าแก้ไขรูปเดิม แล้วเลือกไฟล์ใหม่ ระบบจะอัปโหลดรูปใหม่ขึ้น Cloudinary
    </p>
  </div>
</div>

          <div className="md:col-span-2 rounded-2xl border border-[#ead7b0] bg-[#fffaf0] p-4">
            <p className="mb-3 text-sm font-semibold text-[#6b5b3e]">
              เลือกตำแหน่งการแสดงผล
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 text-sm text-[#4a3b22]">
                <input
                  type="checkbox"
                  checked={form.showInHome}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, showInHome: e.target.checked }))
                  }
                />
                แสดงในหน้าแรก
              </label>

              <label className="flex items-center gap-3 text-sm text-[#4a3b22]">
                <input
                  type="checkbox"
                  checked={form.showInAbout}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, showInAbout: e.target.checked }))
                  }
                />
                แสดงในประวัติวัด
              </label>

              <label className="flex items-center gap-3 text-sm text-[#4a3b22]">
                <input
                  type="checkbox"
                  checked={form.showInGallery}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      showInGallery: e.target.checked,
                    }))
                  }
                />
                แสดงในแกลเลอรี
              </label>

              <label className="flex items-center gap-3 text-sm text-[#4a3b22]">
                <input
                  type="checkbox"
                  checked={form.showInHero}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, showInHero: e.target.checked }))
                  }
                />
                แสดงใน Hero
              </label>
            </div>
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
            disabled={saving || uploadingImage}
            className="rounded-2xl border border-[#d9c39a] px-5 py-3 text-sm font-semibold text-[#6b5b3e] transition hover:bg-[#f8f3ea] disabled:opacity-50"
          >
            ยกเลิก
          </button>

          <button
            onClick={onSubmit}
            disabled={saving || uploadingImage}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c9a34e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a67c2e] disabled:opacity-60"
          >
            {saving || uploadingImage ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                {uploadingImage ? "กำลังอัปโหลดรูป..." : "กำลังบันทึก..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {mode === "create" ? "เพิ่มรูปภาพ" : "บันทึกการแก้ไข"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminGalleryPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [form, setForm] = useState<GalleryForm>(initialForm);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
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
      setLocalPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setLocalPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  async function fetchImages() {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/gallery`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "โหลดรูปภาพไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      const sorted = [...data].sort(
        (a, b) =>
          (a.orderNumber ?? 0) - (b.orderNumber ?? 0) ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setImages(sorted);
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
    fetchImages();
  }, []);

  const activeImages = useMemo(
    () => images.filter((item) => item.isActive),
    [images]
  );

  function openCreateModal() {
    setModalMode("create");
    setEditingItem(null);
    setForm(initialForm);
    setSelectedFile(null);
    setLocalPreview("");
    setModalOpen(true);
  }

  function openEditModal(item: GalleryItem) {
    setModalMode("edit");
    setEditingItem(item);
    setForm({
      title: item.title || "",
      description: item.description || "",
      orderNumber: String(item.orderNumber ?? ""),
      isActive: item.isActive,
      showInHome: !!item.showInHome,
      showInAbout: !!item.showInAbout,
      showInGallery: item.showInGallery ?? true,
      showInHero: !!item.showInHero,
    });
    setSelectedFile(null);
    setLocalPreview(item.imageUrl || "");
    setModalOpen(true);
  }

  async function uploadFileToCloudinary() {
    if (!selectedFile) return null;

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch(`${API_URL}/gallery/upload`, {
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
        message: "กรุณาระบุชื่อรูปภาพ",
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
          message: "กรุณาเลือกรูปภาพก่อนบันทึก",
          type: "error",
        });
        return;
      }

      const payload = {
        title: form.title,
        description: form.description || null,
        imageUrl: uploaded?.url ?? editingItem?.imageUrl,
        publicId: uploaded?.publicId ?? editingItem?.publicId,
        orderNumber:
          form.orderNumber === "" ? undefined : Number(form.orderNumber),
        isActive: form.isActive,
        showInHome: form.showInHome,
        showInAbout: form.showInAbout,
        showInGallery: form.showInGallery,
        showInHero: form.showInHero,
        deleteOldImage: !!uploaded && modalMode === "edit",
      };

      const url =
        modalMode === "create"
          ? `${API_URL}/gallery`
          : `${API_URL}/gallery/${editingItem?.id}`;

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
          message: data.message || "บันทึกรูปภาพไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      setToast({
        open: true,
        message:
          modalMode === "create"
            ? "เพิ่มรูปภาพสำเร็จ"
            : "แก้ไขรูปภาพสำเร็จ",
        type: "success",
      });

      setModalOpen(false);
      setForm(initialForm);
      setEditingItem(null);
      setSelectedFile(null);
      setLocalPreview("");
      await fetchImages();
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "เกิดข้อผิดพลาดในการบันทึกรูปภาพ",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(item: GalleryItem) {
    try {
      setTogglingId(item.id);

      const res = await fetch(`${API_URL}/gallery/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !item.isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "เปลี่ยนสถานะรูปภาพไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      setToast({
        open: true,
        message: "เปลี่ยนสถานะรูปภาพสำเร็จ",
        type: "success",
      });

      await fetchImages();
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ",
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

      const res = await fetch(`${API_URL}/gallery/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "ลบรูปภาพไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      setToast({
        open: true,
        message: "ลบรูปภาพสำเร็จ",
        type: "success",
      });

      setDeleteTarget(null);
      await fetchImages();
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "เกิดข้อผิดพลาดในการลบรูปภาพ",
        type: "error",
      });
    } finally {
      setDeletingId(null);
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

      <GalleryModal
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
        saving={saving}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        previewUrl={localPreview}
        uploadingImage={uploadingImage}
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
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b88a2a]">
                Admin Panel
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#8d6720] md:text-4xl">
                จัดการแกลเลอรี
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b5b3e] md:text-base">
                อัปโหลดรูปไปยัง Cloudinary จัดลำดับ เปิด/ปิดการแสดงผล
                และเลือกว่าจะให้รูปไปอยู่ section ไหนของเว็บไซต์
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c9a34e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a67c2e]"
            >
              <ImagePlus className="h-4 w-4" />
              เพิ่มรูปภาพ
            </button>
          </div>

          <div className="mb-6 rounded-[24px] border border-[#ead7b0] bg-white p-4 shadow-sm">
            <p className="text-sm text-[#6b5b3e]">
              รูปทั้งหมด <span className="font-semibold">{images.length}</span> รายการ ·
              เปิดใช้งาน <span className="font-semibold">{activeImages.length}</span> รายการ
            </p>
          </div>

          {loading ? (
            <div className="rounded-[28px] border border-[#ead7b0] bg-white p-10 text-center shadow-sm">
              <div className="flex items-center justify-center gap-3 text-[#6b5b3e]">
                <Loader className="h-5 w-5 animate-spin" />
                <span>กำลังโหลดรูปภาพ...</span>
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#d9c39a] bg-white p-10 text-center text-[#6b5b3e] shadow-sm">
              ยังไม่มีรูปภาพในระบบ
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-[28px] border border-[#ead7b0] bg-white shadow-[0_10px_30px_rgba(166,124,46,0.08)]"
                >
                  <div className="relative">
                    <div className="aspect-[6/5] overflow-hidden bg-[#f6efe2]">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute left-4 top-4 rounded-full bg-[#c9a34e] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      ลำดับ {item.orderNumber}
                    </div>

                    <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#4a3b22] shadow-sm">
                      {item.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                    </div>
                  </div>

                  <div className="p-4">
  <h3 className="text-lg font-bold leading-7 text-[#4a3b22]">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6b5b3e]">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.showInHome && (
                        <span className="rounded-full bg-[#fff7e8] px-3 py-1 text-xs font-semibold text-[#8d6720]">
                          หน้าแรก
                        </span>
                      )}
                      {item.showInAbout && (
                        <span className="rounded-full bg-[#fff7e8] px-3 py-1 text-xs font-semibold text-[#8d6720]">
                          ประวัติวัด
                        </span>
                      )}
                      {item.showInGallery && (
                        <span className="rounded-full bg-[#fff7e8] px-3 py-1 text-xs font-semibold text-[#8d6720]">
                          แกลเลอรี
                        </span>
                      )}
                      {item.showInHero && (
                        <span className="rounded-full bg-[#fff7e8] px-3 py-1 text-xs font-semibold text-[#8d6720]">
                          Hero
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d9c39a] px-3 py-2 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
                      >
                        <Pencil className="h-4 w-4" />
                        แก้ไข
                      </button>

                      <button
                        onClick={() => handleToggle(item)}
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
    </>
  );
}