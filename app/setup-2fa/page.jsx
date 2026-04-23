"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader, ShieldCheck, KeyRound } from "lucide-react";
import SuccessBackupModal from "@/app/components/ui/SuccessBackupModal";

export default function SetupTwoFactorPage() {
  const router = useRouter();
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "/api";

  const [email, setEmail] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [successOpen, setSuccessOpen] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [confirmedSaved, setConfirmedSaved] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("twoFactorSetupToken");
    const savedEmail = localStorage.getItem("twoFactorSetupEmail");

    if (!savedToken) {
      router.replace("/login");
      return;
    }

    setSetupToken(savedToken);
    setEmail(savedEmail || "");
    fetchSetup(savedToken);
  }, [router]);

  async function fetchSetup(token) {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await fetch(`${API_URL}/auth/2fa/setup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "ไม่สามารถเริ่มตั้งค่า 2FA ได้");
        return;
      }

      setQrCode(data.qrCodeDataUrl || "");
      setSecret(data.secret || "");
    } catch (error) {
      console.error("setup 2fa error:", error);
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();

    if (!otpToken.trim()) {
      setErrorMessage("กรุณากรอกรหัส 6 หลัก");
      return;
    }

    if (!/^\d{6}$/.test(otpToken.trim())) {
      setErrorMessage("รหัส 2FA ต้องเป็นตัวเลข 6 หลัก");
      return;
    }

    try {
      setVerifying(true);
      setErrorMessage("");

      const res = await fetch(`${API_URL}/auth/2fa/verify-setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${setupToken}`,
        },
        body: JSON.stringify({
          token: otpToken.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "ยืนยัน 2FA ไม่สำเร็จ");
        return;
      }

      setBackupCodes(data.backupCodes || []);
      setConfirmedSaved(false);
      setSuccessOpen(true);
    } catch (error) {
      console.error("verify setup 2fa error:", error);
      setErrorMessage("เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ");
    } finally {
      setVerifying(false);
    }
  }

  function handleCloseSuccessModal() {
    localStorage.removeItem("twoFactorSetupToken");
    localStorage.removeItem("twoFactorSetupEmail");
    router.replace("/login");
  }

  return (
    <>
      <SuccessBackupModal
        open={successOpen}
        backupCodes={backupCodes}
        confirmedSaved={confirmedSaved}
        onConfirmSaved={setConfirmedSaved}
        onClose={handleCloseSuccessModal}
      />

      <main className="flex min-h-screen items-center justify-center bg-[#f8f3ea] px-4 py-10">
        <div className="w-full max-w-2xl rounded-[32px] border border-[#ead7b0] bg-white p-6 shadow-[0_18px_40px_rgba(166,124,46,0.10)] md:p-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b88a2a]">
              2FA Setup
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#8d6720]">
              ตั้งค่า Two-Factor Authentication
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#6b5b3e]">
              กรุณาสแกน QR Code ด้วยแอป Authenticator แล้วกรอกรหัส 6
              หลักเพื่อเปิดใช้งาน
            </p>
            <Link
  href="/"
  className="mt-4 inline-flex items-center justify-center text-sm font-semibold text-[#8d6720] transition hover:text-[#a67c2e]"
>
  ← กลับหน้าแรก
</Link>
          </div>

          <div className="mt-6 rounded-2xl border border-[#ead7b0] bg-[#fffaf0] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88a2a]">
              Email
            </p>
            <p className="mt-1 text-sm font-medium text-[#4a3b22]">{email}</p>
          </div>

          {loading ? (
            <div className="mt-8 flex items-center justify-center gap-3 text-[#6b5b3e]">
              <Loader className="h-5 w-5 animate-spin" />
              <span>กำลังสร้าง QR Code...</span>
            </div>
          ) : (
            <>
              {qrCode && (
                <div className="mt-8 flex justify-center">
                  <div className="rounded-[28px] border border-[#ead7b0] bg-white p-4 shadow-sm">
                    <img
                      src={qrCode}
                      alt="2FA QR Code"
                      className="h-64 w-64"
                    />
                  </div>
                </div>
              )}

              {secret && (
                <div className="mt-6 rounded-2xl border border-dashed border-[#d9c39a] bg-[#fffdf9] px-4 py-4 text-sm text-[#6b5b3e]">
                  <div className="flex items-center gap-2 font-semibold text-[#8d6720]">
                    <KeyRound className="h-4 w-4" />
                    Secret Key
                  </div>

                  <p className="mt-2 break-all font-mono text-[#4a3b22]">
                    {secret}
                  </p>
                </div>
              )}

              <form onSubmit={handleVerify} className="mt-8 space-y-5">
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
                        setOtpToken(
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      placeholder="กรอกรหัส 6 หลัก"
                      className="w-full rounded-2xl border border-[#d9c39a] bg-white py-3 pl-11 pr-4 text-sm tracking-[0.2em] text-[#4a3b22] outline-none transition focus:border-[#c9a34e] focus:ring-2 focus:ring-[#f3e4bc]"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={verifying}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c9a34e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a67c2e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {verifying ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      กำลังยืนยัน...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      เปิดใช้งาน 2FA
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </>
  );
}