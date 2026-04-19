"use client";

import { useEffect, useMemo, useState } from "react";
import Toast from "@/app/components/ui/Toast";
import { Loader, Trash2, Eye, EyeOff, X, Search, Save } from "lucide-react";

type VideoItem = {
  id: string;
  title: string;
  youtubeUrl?: string | null;
  tiktokUrl?: string | null;
  thumbnailUrl?: string | null;
  thumbnailPublicId?: string | null;
  orderNumber: number;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
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
        <Loader className="h-14 w-14 animate-spin text-[#9fd27a]" />
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
              Delete Video
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#8d6720]">
              ยืนยันการลบวิดีโอ
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#6b5b3e]">
              คุณต้องการลบวิดีโอนี้ใช่หรือไม่? เมื่อลบแล้วจะไม่สามารถเรียกคืนได้
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
              ชื่อวิดีโอ
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

export default function AdminVideoPage() {
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [orderMap, setOrderMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("กำลังดำเนินการ...");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({
    open: false,
    message: "",
    type: "success",
  });

  const [deleteTarget, setDeleteTarget] = useState<VideoItem | null>(null);

  const API_URL = "http://localhost:5001/api";

  async function fetchVideos() {
    try {
      const res = await fetch(`${API_URL}/video`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "โหลดรายการวิดีโอไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      const sorted = [...data].sort(
        (a, b) =>
          (a.orderNumber ?? 0) - (b.orderNumber ?? 0) ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setVideos(sorted);

      const nextOrderMap: Record<string, number> = {};
      sorted.forEach((item: VideoItem) => {
        nextOrderMap[item.id] = item.orderNumber ?? 0;
      });
      setOrderMap(nextOrderMap);
    } catch {
      setToast({
        open: true,
        message: "เชื่อมต่อ backend ไม่สำเร็จ",
        type: "error",
      });
    }
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return videos;

    return videos.filter((video) => {
      const title = video.title?.toLowerCase() || "";
      const tiktokUrl = video.tiktokUrl?.toLowerCase() || "";
      return title.includes(keyword) || tiktokUrl.includes(keyword);
    });
  }, [videos, searchTerm]);

  async function handleCreateVideo() {
    if (!tiktokUrl.trim()) {
      setToast({
        open: true,
        message: "กรุณาใส่ลิงก์ TikTok",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      setActionLoading(true);
      setLoadingText("กำลังสร้างวิดีโอ...");

      const res = await fetch(`${API_URL}/video/tiktok`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tiktokUrl,
          title: customTitle.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "สร้างวิดีโอไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      setToast({
        open: true,
        message: "สร้างวิดีโอสำเร็จ",
        type: "success",
      });

      setTiktokUrl("");
      setCustomTitle("");
      await fetchVideos();
    } catch {
      setToast({
        open: true,
        message: "เกิดข้อผิดพลาดในการสร้างวิดีโอ",
        type: "error",
      });
    } finally {
      setLoading(false);
      setActionLoading(false);
    }
  }

  async function handleDeleteVideo(id: string) {
    try {
      setDeletingId(id);
      setActionLoading(true);
      setLoadingText("กำลังลบวิดีโอ...");

      const res = await fetch(`${API_URL}/video/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "ลบวิดีโอไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      setToast({
        open: true,
        message: "ลบวิดีโอสำเร็จ",
        type: "success",
      });

      setDeleteTarget(null);
      await fetchVideos();
    } catch {
      setToast({
        open: true,
        message: "เกิดข้อผิดพลาดในการลบวิดีโอ",
        type: "error",
      });
    } finally {
      setDeletingId(null);
      setActionLoading(false);
    }
  }

  async function handleToggleVideo(id: string) {
    try {
      setTogglingId(id);

      const res = await fetch(`${API_URL}/video/${id}/toggle`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "เปลี่ยนสถานะวิดีโอไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      setToast({
        open: true,
        message: "เปลี่ยนสถานะวิดีโอสำเร็จ",
        type: "success",
      });

      await fetchVideos();
    } catch {
      setToast({
        open: true,
        message: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะวิดีโอ",
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

  // ✅ เช็กซ้ำจากข้อมูลในหน้า
  const duplicated = videos.find(
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

    const res = await fetch(`${API_URL}/video/${id}/order`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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

    await fetchVideos();
  } catch {
    setToast({
      open: true,
      message: "เกิดข้อผิดพลาดในการบันทึกลำดับ",
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
          if (deleteTarget) handleDeleteVideo(deleteTarget.id);
        }}
        loading={!!deletingId}
      />

      <div className="min-h-screen bg-[#f8f3ea] px-4 py-8 text-[#4a3b22] md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b88a2a]">
              Admin Panel
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#8d6720] md:text-4xl">
              จัดการวิดีโอ TikTok
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b5b3e] md:text-base">
              วางลิงก์ TikTok แล้วระบบจะดึงข้อมูลวิดีโอ สร้างรูปปกจาก TikTok
              อัปโหลดเข้า Cloudinary และบันทึกลงฐานข้อมูลให้อัตโนมัติ
            </p>
          </div>

          <div className="rounded-[28px] border border-[#ead7b0] bg-white p-5 shadow-[0_10px_30px_rgba(166,124,46,0.08)] md:p-7">
            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                  ลิงก์ TikTok
                </label>
                <input
                  type="text"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@user/video/..."
                  className="w-full rounded-2xl border border-[#d9c39a] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                />
                
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                  ชื่อวิดีโอ (ถ้าไม่กรอก ระบบจะใช้ชื่อจาก TikTok)
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="ใส่ชื่อวิดีโอเพิ่มเติม"
                  className="w-full rounded-2xl border border-[#d9c39a] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                />
                
              </div>

              <div className="pt-1">
                <button
                  onClick={handleCreateVideo}
                  disabled={loading || actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c9a34e] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#a67c2e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && <Loader className="h-4 w-4 animate-spin" />}
                  {loading ? "กำลังสร้าง..." : "สร้างวิดีโอ"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-[#ead7b0] bg-white p-4 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
              ค้นหาวิดีโอ
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7a5d]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาจากชื่อวิดีโอ หรือลิงก์ TikTok"
                className="w-full rounded-2xl border border-[#d9c39a] bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
              />
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#8d6720]">รายการวิดีโอ</h2>
              <p className="mt-1 text-sm text-[#6b5b3e]">
                ทั้งหมด {filteredVideos.length} รายการ
              </p>
            </div>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="mt-5 rounded-[28px] border border-dashed border-[#d9c39a] bg-white p-10 text-center text-[#6b5b3e] shadow-sm">
              ไม่พบวิดีโอ
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="group overflow-hidden rounded-[24px] border border-[#ead7b0] bg-white shadow-[0_8px_24px_rgba(166,124,46,0.08)] transition hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(166,124,46,0.14)]"
                >
                  <div className="aspect-[1/1] overflow-hidden bg-[#f6efe2]">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-[#6b5b3e]">
                        ไม่มีรูปปก
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 min-h-[40px] text-base font-semibold leading-6 text-[#4a3b22]">
                      {video.title}
                    </h3>

                    {video.tiktokUrl && (
                      <a
                        href={video.tiktokUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm font-medium text-blue-600 underline underline-offset-2"
                      >
                        เปิดลิงก์ TikTok
                      </a>
                    )}

                    <div className="mt-3 space-y-1 text-xs text-[#8a7a5d]">
                      <p>
                        สถานะ:{" "}
                        <span
                          className={`font-medium ${
                            video.isActive ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          {video.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                        </span>
                      </p>
                      <p>
                        สร้างเมื่อ: {new Date(video.createdAt).toLocaleString("th-TH")}
                      </p>
                    </div>

                    <div className="mt-3">
  <label className="mb-1 block text-[11px] font-semibold text-[#6b5b3e]">
    ลำดับการแสดง
  </label>

  <div className="flex items-center gap-2">
    <input
      type="number"
      min={0}
      value={orderMap[video.id] ?? 0}
      onChange={(e) =>
        setOrderMap((prev) => ({
          ...prev,
          [video.id]: Number(e.target.value),
        }))
      }
      className={`w-full rounded-xl px-3 py-2 text-sm outline-none transition focus:ring-2 ${
        videos.some(
          (item) =>
            item.id !== video.id &&
            Number(item.orderNumber) === Number(orderMap[video.id] ?? 0)
        )
          ? "border border-red-300 focus:border-red-400 focus:ring-red-100"
          : "border border-[#d9c39a] focus:border-[#c9a34e] focus:ring-[#f3e4bc]"
      }`}
    />

    <button
      onClick={() => handleSaveOrder(video.id)}
      disabled={savingOrderId === video.id}
      title="บันทึกลำดับ"
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d9c39a] text-[#8d6720] transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {savingOrderId === video.id ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Save className="h-4 w-4" />
      )}
    </button>
  </div>

  {videos.some(
    (item) =>
      item.id !== video.id &&
      Number(item.orderNumber) === Number(orderMap[video.id] ?? 0)
  ) && (
    <p className="mt-1 text-[11px] text-red-500">
      ลำดับนี้ถูกใช้งานแล้ว
    </p>
  )}
</div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => handleToggleVideo(video.id)}
                        disabled={togglingId === video.id}
                        title={video.isActive ? "ปิดการใช้งาน" : "เปิดการใช้งาน"}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          video.isActive
                            ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                            : "border-green-200 text-green-700 hover:bg-green-50"
                        }`}
                      >
                        {togglingId === video.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : video.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        onClick={() => setDeleteTarget(video)}
                        disabled={!!deletingId}
                        title="ลบวิดีโอ"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === video.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
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