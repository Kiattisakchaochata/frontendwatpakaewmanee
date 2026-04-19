"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

type ToastProps = {
  open: boolean;
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function Toast({
  open,
  message,
  type = "success",
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed right-5 top-5 z-[10000]">
      <div
        className={`flex min-w-[280px] items-center gap-3 rounded-2xl px-4 py-3 shadow-xl ${
          type === "success"
            ? "border border-green-200 bg-green-50 text-green-700"
            : "border border-red-200 bg-red-50 text-red-700"
        }`}
      >
        {type === "success" ? (
          <CheckCircle2 className="h-5 w-5 shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 shrink-0" />
        )}

        <p className="flex-1 text-sm font-medium">{message}</p>

        <button
          onClick={onClose}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-black/5"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}