"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { setAuth } from "@/lib/auth";

export default function LoginPageClient() {
  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "/api";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requiresTwoFactorSetup && data.setupToken) {
          localStorage.setItem("twoFactorSetupToken", data.setupToken);
          localStorage.setItem("twoFactorSetupEmail", data.email || email.trim());
          router.replace("/setup-2fa");
          return;
        }

        setErrorMessage(data.message || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      if (data.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setOtpToken("");
        return;
      }

      setAuth(data.token, data.user);
      router.replace("/admin");
    } catch (error) {
      console.error("login error:", error);
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyTwoFactor(e) {
    e.preventDefault();

    if (!otpToken.trim()) {
      setErrorMessage("กรุณากรอกรหัสยืนยัน 2FA");
      return;
    }

    if (!/^\d{6}$/.test(otpToken.trim())) {
      setErrorMessage("รหัส 2FA ต้องเป็นตัวเลข 6 หลัก");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await fetch(`${API_URL}/auth/login-2fa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          token: otpToken.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "ยืนยันรหัส 2FA ไม่สำเร็จ");
        return;
      }

      setAuth(data.token, data.user);
      router.replace("/admin");
    } catch (error) {
      console.error("verify 2fa error:", error);
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  function handleBackToLogin() {
    setRequiresTwoFactor(false);
    setOtpToken("");
    setErrorMessage("");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f3ea] px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-[#ead7b0] bg-white p-6 shadow-[0_18px_40px_rgba(166,124,46,0.10)] md:p-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b88a2a]">
            Admin Login
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#8d6720]">
            {requiresTwoFactor ? "ยืนยันรหัส 2FA" : "เข้าสู่ระบบหลังบ้าน"}
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#6b5b3e]">
            {requiresTwoFactor
              ? "กรอกรหัส 6 หลักจากแอป Authenticator เพื่อเข้าสู่ระบบ"
              : "สำหรับ Super Admin และ Admin เท่านั้น"}
          </p>
        </div>

        {!requiresTwoFactor ? (
          <form
            onSubmit={handleLogin}
            autoComplete="off"
            className="mt-8 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                อีเมล
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7a5d]" />
                <input
                  type="email"
                  name="admin_login_email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="กรอกอีเมล"
                  className="w-full rounded-2xl border border-[#d9c39a] bg-white py-3 pl-11 pr-4 text-sm text-[#4a3b22] outline-none transition focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                รหัสผ่าน
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7a5d]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="admin_login_password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  className="w-full rounded-2xl border border-[#d9c39a] bg-white py-3 pl-11 pr-12 text-sm text-[#4a3b22] outline-none transition focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a7a5d] transition hover:text-[#8d6720]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c9a34e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a67c2e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </button>

              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[#d9c39a] bg-white px-5 py-3 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
              >
                กลับหน้าแรก
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyTwoFactor} className="mt-8 space-y-5">
            <div className="rounded-2xl border border-[#ead7b0] bg-[#fffaf0] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
                Email
              </p>
              <p className="mt-1 text-sm font-medium text-[#4a3b22]">{email}</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#6b5b3e]">
                รหัสยืนยัน 2FA
              </label>

              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7a5d]" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpToken}
                  onChange={(e) =>
                    setOtpToken(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="กรอกรหัส 6 หลัก"
                  className="w-full rounded-2xl border border-[#d9c39a] bg-white py-3 pl-11 pr-4 text-sm tracking-[0.2em] text-[#4a3b22] outline-none transition focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                />
              </div>

              <p className="mt-2 text-xs text-[#8a7a5d]">
                เปิดแอป Google Authenticator หรือ Microsoft Authenticator แล้วกรอกรหัส 6 หลัก
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBackToLogin}
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#d9c39a] px-5 py-3 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ArrowLeft className="h-4 w-4" />
                ย้อนกลับ
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#c9a34e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a67c2e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    กำลังยืนยัน...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    ยืนยัน 2FA
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}