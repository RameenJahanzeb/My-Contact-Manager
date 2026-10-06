"use client";

import { useEffect } from "react";

export interface ToastState {
  type: "success" | "error";
  message: string;
}

interface ToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      aria-live={isSuccess ? "polite" : "assertive"}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <div
        className={`toast-in flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl shadow-blue-950/10 ${
          isSuccess
            ? "border-blue-200 bg-white text-blue-800"
            : "border-red-200 bg-white text-red-800"
        }`}
      >
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
            isSuccess ? "bg-blue-600" : "bg-red-600"
          }`}
          aria-hidden="true"
        >
          {isSuccess ? "✓" : "!"}
        </span>
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="ml-1 rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
