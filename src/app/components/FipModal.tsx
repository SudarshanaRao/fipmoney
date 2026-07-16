"use client";

import { useEffect, useRef } from "react";
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export type ModalVariant = "error" | "success" | "info" | "warning" | "confirm";

interface FipModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  variant?: ModalVariant;
  // For confirm modals
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const variantConfig = {
  error: {
    Icon: AlertCircle,
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
    borderColor: "border-red-100",
    btnGradient: "from-red-500 to-rose-500",
    btnShadow: "shadow-[0_4px_14px_rgba(239,68,68,0.25)]",
  },
  success: {
    Icon: CheckCircle2,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    borderColor: "border-emerald-100",
    btnGradient: "from-emerald-500 to-teal-500",
    btnShadow: "shadow-[0_4px_14px_rgba(16,185,129,0.25)]",
  },
  info: {
    Icon: Info,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    borderColor: "border-blue-100",
    btnGradient: "from-blue-500 to-indigo-500",
    btnShadow: "shadow-[0_4px_14px_rgba(59,130,246,0.25)]",
  },
  warning: {
    Icon: AlertTriangle,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    borderColor: "border-amber-100",
    btnGradient: "from-amber-500 to-orange-500",
    btnShadow: "shadow-[0_4px_14px_rgba(245,158,11,0.25)]",
  },
  confirm: {
    Icon: AlertTriangle,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    borderColor: "border-amber-100",
    btnGradient: "from-amber-500 to-orange-500",
    btnShadow: "shadow-[0_4px_14px_rgba(245,158,11,0.25)]",
  },
};

export default function FipModal({
  open,
  onClose,
  title,
  message,
  variant = "info",
  onConfirm,
  confirmText = "Yes, Continue",
  cancelText = "Cancel",
}: FipModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const config = variantConfig[variant];
  const VIcon = config.Icon;
  const isConfirm = variant === "confirm";

  const autoTitle =
    title ||
    (variant === "error"
      ? "Oops!"
      : variant === "success"
      ? "Success"
      : variant === "warning"
      ? "Attention"
      : variant === "confirm"
      ? "Are you sure?"
      : "Notice");

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-sm overflow-hidden"
        style={{
          animation: "fipModalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all cursor-pointer outline-none border-none z-10"
        >
          <X size={15} strokeWidth={2.5} />
        </button>

        {/* Content */}
        <div className="p-6 pt-8 flex flex-col items-center text-center">
          {/* Icon */}
          <div
            className={`w-16 h-16 rounded-2xl ${config.iconBg} ${config.iconColor} flex items-center justify-center mb-5 border ${config.borderColor}`}
          >
            <VIcon size={28} strokeWidth={2} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-extrabold text-gray-900 tracking-tight mb-2">
            {autoTitle}
          </h3>

          {/* Message */}
          <p className="text-sm font-semibold text-gray-500 leading-relaxed max-w-[280px]">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 pt-2">
          {isConfirm ? (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl text-sm font-extrabold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all outline-none border-none cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
                className={`flex-1 py-3.5 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r ${config.btnGradient} ${config.btnShadow} hover:-translate-y-0.5 transition-all outline-none border-none cursor-pointer`}
              >
                {confirmText}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className={`w-full py-3.5 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r ${config.btnGradient} ${config.btnShadow} hover:-translate-y-0.5 transition-all outline-none border-none cursor-pointer`}
            >
              Got it
            </button>
          )}
        </div>

        {/* Fipmoney branding */}
        <div className="border-t border-gray-50 py-2.5 text-center">
          <span className="text-[10px] font-bold text-gray-300 tracking-wider">
            FIPMONEY SECURE
          </span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fipModalIn {
          0% { opacity: 0; transform: scale(0.9) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />
    </div>
  );
}

// ─── Hook for easy usage ───────────────────────────────────────────────────
import { useState, useCallback } from "react";

interface ModalState {
  open: boolean;
  title?: string;
  message: string;
  variant: ModalVariant;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function useFipModal() {
  const [state, setState] = useState<ModalState>({
    open: false,
    message: "",
    variant: "info",
  });

  const showAlert = useCallback(
    (message: string, variant: ModalVariant = "error", title?: string) => {
      setState({ open: true, message, variant, title });
    },
    []
  );

  const showConfirm = useCallback(
    (
      message: string,
      onConfirm: () => void,
      options?: { title?: string; confirmText?: string; cancelText?: string }
    ) => {
      setState({
        open: true,
        message,
        variant: "confirm",
        onConfirm,
        title: options?.title,
        confirmText: options?.confirmText,
        cancelText: options?.cancelText,
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const ModalComponent = (
    <FipModal
      open={state.open}
      onClose={closeModal}
      title={state.title}
      message={state.message}
      variant={state.variant}
      onConfirm={state.onConfirm}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
    />
  );

  return { showAlert, showConfirm, ModalComponent };
}
