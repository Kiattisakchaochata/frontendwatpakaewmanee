"use client";

import { useEffect, useState } from "react";
import Toast from "@/app/components/ui/Toast";
import { getToken, getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
  Loader,
  Shield,
  UserPlus,
  Trash2,
  Pencil,
  Save,
  X,
  Users,
  AlertTriangle,
} from "lucide-react";

function DeleteConfirmModal({
  open,
  userName,
  loading,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-[28px] border border-[#ead7b0] bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-[#8d6720]">ยืนยันการลบผู้ใช้</h3>
            <p className="mt-2 text-sm leading-7 text-[#6b5b3e]">
              คุณต้องการลบผู้ใช้{" "}
              <span className="font-semibold text-[#4a3b22]">
                {userName || "รายการนี้"}
              </span>{" "}
              ใช่หรือไม่
            </p>
            <p className="mt-1 text-sm leading-7 text-red-500">
              เมื่อลบแล้วจะไม่สามารถกู้คืนได้
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl border border-[#d9c39a] px-4 py-2.5 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8] disabled:opacity-60"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                กำลังลบ...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                ยืนยันลบ
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const router = useRouter();
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

  const currentUser = getUser();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [saving, setSaving] = useState(false);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("ADMIN");
  const [editPassword, setEditPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  function getAuthHeaders(extra = {}) {
    const token = getToken();

    return {
      ...extra,
      Authorization: `Bearer ${token}`,
    };
  }

  async function loadUsers() {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/admin-users`, {
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "โหลดผู้ใช้ไม่สำเร็จ");
      }

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("loadUsers error:", error);
      setToast({
        open: true,
        message: error.message || "โหลดผู้ใช้ไม่สำเร็จ",
        type: "error",
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== "SUPER_ADMIN") {
      router.replace("/admin");
      return;
    }

    loadUsers();
  }, []);

  async function handleCreateUser(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setToast({
        open: true,
        message: "กรุณากรอกอีเมลและรหัสผ่าน",
        type: "error",
      });
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`${API_URL}/auth/admin-users`, {
        method: "POST",
        headers: getAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          name: name.trim() || null,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "สร้างผู้ใช้ไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      setEmail("");
      setPassword("");
      setName("");
      setRole("ADMIN");

      await loadUsers();

      setToast({
        open: true,
        message: "สร้างผู้ใช้สำเร็จ",
        type: "success",
      });
    } catch (error) {
      console.error("create user error:", error);
      setToast({
        open: true,
        message: "เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  function startEdit(user) {
    setEditingUserId(user.id);
    setEditName(user.name || "");
    setEditRole(user.role || "ADMIN");
    setEditPassword("");
  }

  function cancelEdit() {
    setEditingUserId(null);
    setEditName("");
    setEditRole("ADMIN");
    setEditPassword("");
  }

  async function handleUpdateUser(id) {
    try {
      setUpdating(true);

      const payload = {
        name: editName.trim() || null,
        role: editRole,
      };

      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      const res = await fetch(`${API_URL}/auth/admin-users/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "แก้ไขผู้ใช้ไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      cancelEdit();
      await loadUsers();

      setToast({
        open: true,
        message: "แก้ไขผู้ใช้สำเร็จ",
        type: "success",
      });
    } catch (error) {
      console.error("update user error:", error);
      setToast({
        open: true,
        message: "เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ",
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  }

  async function handleDeleteUser() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      const res = await fetch(`${API_URL}/auth/admin-users/${deleteTarget.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data.message || "ลบผู้ใช้ไม่สำเร็จ",
          type: "error",
        });
        return;
      }

      setDeleteTarget(null);
      await loadUsers();

      setToast({
        open: true,
        message: "ลบผู้ใช้สำเร็จ",
        type: "success",
      });
    } catch (error) {
      console.error("delete user error:", error);
      setToast({
        open: true,
        message: "เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ",
        type: "error",
      });
    } finally {
      setDeleting(false);
    }
  }

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return null;
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

      <DeleteConfirmModal
        open={!!deleteTarget}
        userName={deleteTarget?.name || deleteTarget?.email}
        loading={deleting}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
        onConfirm={handleDeleteUser}
      />

      <div className="min-h-screen bg-[#f8f3ea] px-4 py-8 text-[#4a3b22] md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[#ead7b0] bg-white px-4 py-2 text-sm font-semibold text-[#8d6720] shadow-sm">
              <Shield className="h-4 w-4" />
              Super Admin Only
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#8d6720] md:text-4xl">
              จัดการผู้ใช้หลังบ้าน
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#6b5b3e] md:text-base">
              SUPER_ADMIN สามารถสร้าง แก้ไข และลบผู้ใช้ได้ ส่วน ADMIN ไม่มีสิทธิ์จัดการผู้ใช้
            </p>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="self-start rounded-[28px] border border-[#ead7b0] bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-bold text-[#8d6720]">
                <UserPlus className="h-5 w-5" />
                เพิ่มผู้ใช้ใหม่
              </h2>

              <form onSubmit={handleCreateUser} className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                    ชื่อ
                  </label>
                  <input
                    type="text"
                    placeholder="ชื่อผู้ใช้"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-[#d9c39a] px-4 py-3 text-sm outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    placeholder="อีเมล"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-[#d9c39a] px-4 py-3 text-sm outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                    รหัสผ่าน
                  </label>
                  <input
                    type="password"
                    placeholder="รหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-[#d9c39a] px-4 py-3 text-sm outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                    สิทธิ์
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-2xl border border-[#d9c39a] px-4 py-3 text-sm outline-none focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c9a34e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a67c2e] disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      เพิ่มผู้ใช้
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="self-start rounded-[28px] border border-[#ead7b0] bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-bold text-[#8d6720]">
                <Users className="h-5 w-5" />
                รายการผู้ใช้
              </h2>

              {loading ? (
                <div className="mt-6 flex items-center gap-3 text-[#6b5b3e]">
                  <Loader className="h-5 w-5 animate-spin" />
                  กำลังโหลดผู้ใช้...
                </div>
              ) : users.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-[#d9c39a] bg-[#fffdf9] p-6 text-sm text-[#6b5b3e]">
                  ยังไม่มีผู้ใช้ในระบบ
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {users.map((user) => {
                    const isEditing = editingUserId === user.id;
                    const isMyself = user.id === currentUser?.id;

                    return (
                      <div
                        key={user.id}
                        className="rounded-2xl border border-[#ead7b0] bg-[#fffdf9] p-4"
                      >
                        {!isEditing ? (
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-lg font-bold text-[#4a3b22]">
                                {user.name || "-"}
                              </p>
                              <p className="mt-1 text-sm text-[#6b5b3e]">
                                {user.email}
                              </p>
                              <p className="mt-2 text-xs font-semibold text-[#b88a2a]">
                                {user.role}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(user)}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#d9c39a] px-3 py-2 text-sm font-semibold text-[#8d6720] hover:bg-[#fff7e8]"
                              >
                                <Pencil className="h-4 w-4" />
                                แก้ไข
                              </button>

                              {!isMyself && (
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(user)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  ลบ
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <label className="mb-1 block text-sm font-semibold text-[#6b5b3e]">
                                ชื่อ
                              </label>
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full rounded-xl border border-[#d9c39a] px-3 py-2 text-sm outline-none focus:border-[#c9a34e]"
                              />
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-semibold text-[#6b5b3e]">
                                สิทธิ์
                              </label>
                              <select
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                disabled={isMyself}
                                className="w-full rounded-xl border border-[#d9c39a] px-3 py-2 text-sm outline-none focus:border-[#c9a34e] disabled:bg-gray-100"
                              >
                                <option value="ADMIN">ADMIN</option>
                                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                              </select>
                            </div>

                            <div>
                              <label className="mb-1 block text-sm font-semibold text-[#6b5b3e]">
                                รหัสผ่านใหม่
                              </label>
                              <input
                                type="password"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                                placeholder="เว้นว่างถ้าไม่ต้องการเปลี่ยน"
                                className="w-full rounded-xl border border-[#d9c39a] px-3 py-2 text-sm outline-none focus:border-[#c9a34e]"
                              />
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateUser(user.id)}
                                disabled={updating}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#c9a34e] px-3 py-2 text-sm font-semibold text-white hover:bg-[#a67c2e] disabled:opacity-60"
                              >
                                {updating ? (
                                  <Loader className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                                บันทึก
                              </button>

                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#d9c39a] px-3 py-2 text-sm font-semibold text-[#8d6720] hover:bg-[#fff7e8]"
                              >
                                <X className="h-4 w-4" />
                                ยกเลิก
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}