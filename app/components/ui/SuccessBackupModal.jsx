"use client";

export default function SuccessBackupModal({
  open,
  backupCodes = [],
  confirmedSaved,
  onConfirmSaved,
  onClose,
}) {
  if (!open) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(backupCodes.join("\n"));
    } catch (error) {
      console.error("copy backup codes error:", error);
    }
  }

  function handleDownload() {
    try {
      const content = `Wat Pa Kaew Admin - Backup Codes\n\n${backupCodes.join(
        "\n"
      )}`;
      const blob = new Blob([content], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "backup-codes.txt";
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("download backup codes error:", error);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/30 backdrop-blur-[2px]">
      <div className="flex min-h-full items-start justify-center px-4 py-6 md:items-center md:py-10">
        <div className="w-full max-w-2xl rounded-[28px] border border-[#ead7b0] bg-white p-5 shadow-2xl md:p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#8d6720] md:text-3xl">
              เปิดใช้งาน 2FA สำเร็จ
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#6b5b3e] md:text-base">
              กรุณาเก็บ Backup Codes ไว้ในที่ปลอดภัย หากคุณไม่สามารถเข้าแอป
              Authenticator ได้ คุณจะใช้รหัสเหล่านี้เพื่อกู้การเข้าสู่ระบบ
            </p>
          </div>

          <div className="mt-6 grid gap-3 rounded-[24px] border border-[#ead7b0] bg-[#fffdf9] p-4 sm:grid-cols-2">
            {backupCodes.map((code) => (
              <div
                key={code}
                className="rounded-2xl border border-[#ead7b0] bg-white px-4 py-3 text-center font-mono text-xl font-bold tracking-[0.18em] text-[#4a3b22] md:text-2xl"
              >
                {code}
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center rounded-2xl border border-[#d9c39a] px-4 py-3 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
            >
              คัดลอกทั้งหมด
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center justify-center rounded-2xl border border-[#d9c39a] px-4 py-3 text-sm font-semibold text-[#8d6720] transition hover:bg-[#fff7e8]"
            >
              ดาวน์โหลดไฟล์
            </button>
          </div>

          <label className="mt-6 flex items-start gap-3 rounded-2xl border border-[#ead7b0] bg-[#fffaf0] px-4 py-4">
            <input
              type="checkbox"
              checked={confirmedSaved}
              onChange={(e) => onConfirmSaved(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 rounded border-[#d9c39a]"
            />
            <span className="text-sm leading-7 text-[#6b5b3e] md:text-base">
              ฉันได้บันทึก Backup Codes ไว้เรียบร้อยแล้ว
            </span>
          </label>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={!confirmedSaved}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[#c9a34e] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a67c2e] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              กลับไปหน้าเข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}