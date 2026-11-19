"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowUpCircle, 
  CheckCircle2, 
  X, 
  Smartphone, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { 
  AppVersionInfo, 
  CURRENT_APP_VERSION, 
  CURRENT_VERSION_CODE,
  fetchLatestAppVersion, 
  shouldShowUpdatePrompt, 
  openGooglePlayStore, 
  dismissUpdatePrompt 
} from "../utils/appUpdateService";

interface AppUpdateModalProps {
  manualCheckTrigger?: number;
  onCheckComplete?: (hasUpdate: boolean) => void;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({
  manualCheckTrigger,
  onCheckComplete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const checkVersion = async (isManual = false) => {
    setLoading(true);
    try {
      const info = await fetchLatestAppVersion();
      if (info) {
        setVersionInfo(info);
        const shouldShow = shouldShowUpdatePrompt(info, isManual);
        setIsOpen(shouldShow);
        onCheckComplete?.(info.latestVersionCode > CURRENT_VERSION_CODE);
      } else {
        onCheckComplete?.(false);
      }
    } catch {
      onCheckComplete?.(false);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount (silent check)
  useEffect(() => {
    // Slight delay so the app finishes initial render/auth check
    const timer = setTimeout(() => {
      checkVersion(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Listen to manual check trigger if provided
  useEffect(() => {
    if (manualCheckTrigger && manualCheckTrigger > 0) {
      checkVersion(true);
    }
  }, [manualCheckTrigger]);

  if (!isOpen || !versionInfo) return null;

  const isForced = versionInfo.forceUpdate || versionInfo.minSupportedVersionCode > CURRENT_VERSION_CODE;

  const handleUpdateClick = () => {
    openGooglePlayStore(versionInfo.playStoreUrl);
  };

  const handleDismiss = () => {
    if (!isForced) {
      dismissUpdatePrompt(24);
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
        style={{ paddingTop: "max(calc(env(safe-area-inset-top, 0px) + 1.5rem), 2rem)" }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-left"
        >
          {/* Top Decorative Gradient Accent */}
          <div className="h-2 w-full bg-linear-to-r from-emerald-500 via-teal-400 to-amber-400" />

          {/* Close button (only if not forced) */}
          {!isForced && (
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}

          <div className="p-6 sm:p-7">
            {/* Play Store & Update Icon Graphic */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-50 to-emerald-100/70 border border-emerald-200/80 flex items-center justify-center text-[#047857] shadow-xs shrink-0">
                <ArrowUpCircle size={30} className="text-[#047857] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-[#047857]">
                    Play Store Update
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    v{versionInfo.latestVersion}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1 leading-snug">
                  {versionInfo.title || "Update Available in Play Store!"}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {versionInfo.description ||
                "A newer and faster version of Fipmoney is now available on Google Play Store. Update now for the best savings experience and new security enhancements."}
            </p>

            {/* What's New Bullet Points */}
            {versionInfo.releaseNotes && versionInfo.releaseNotes.length > 0 && (
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 mb-6">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>What's New in This Version:</span>
                </p>
                <ul className="space-y-2">
                  {versionInfo.releaseNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-slate-700 leading-snug">
                      <CheckCircle2 size={14} className="text-[#047857] shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Current vs New Version Pill */}
            <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-100/80 px-3.5 py-2 rounded-xl mb-6">
              <span>Your Version: <strong className="text-slate-800">v{CURRENT_APP_VERSION}</strong></span>
              <span className="text-slate-300">•</span>
              <span>Latest Version: <strong className="text-[#047857]">v{versionInfo.latestVersion}</strong></span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleUpdateClick}
                className="w-full py-3.5 px-5 rounded-2xl bg-linear-to-r from-[#047857] to-[#059669] hover:from-[#065f46] hover:to-[#047857] text-white font-extrabold text-sm shadow-md shadow-emerald-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink size={16} />
                <span>Update Now on Play Store</span>
              </button>

              {!isForced && (
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer text-center"
                >
                  Remind Me Later
                </button>
              )}
            </div>

            {/* Security Guarantee Micro-footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck size={13} className="text-[#047857]" />
              <span>Verified Safe by Google Play Protect</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppUpdateModal;

