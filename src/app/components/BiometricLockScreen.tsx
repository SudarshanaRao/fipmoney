"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Lock } from "lucide-react";
import { authenticateWithBiometrics } from "../utils/biometricService";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";

interface BiometricLockScreenProps {
  onUnlock: () => void;
  appName?: string;
}

export default function BiometricLockScreen({
  onUnlock,
  appName = "Fipmoney",
}: BiometricLockScreenProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [wasCancelled, setWasCancelled] = useState(false);

  const triggerSystemLockPopup = useCallback(async () => {
    setIsAuthenticating(true);
    setWasCancelled(false);

    try {
      const result = await authenticateWithBiometrics(
        `Unlock ${appName}`,
        "Use your device screen lock or biometrics to continue"
      );

      if (result.success) {
        onUnlock();
      } else {
        setWasCancelled(true);
      }
    } catch {
      setWasCancelled(true);
    } finally {
      setIsAuthenticating(false);
    }
  }, [appName, onUnlock]);

  // Immediately invoke the native Android / iOS system lock popup on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerSystemLockPopup();
    }, 150);

    return () => clearTimeout(timer);
  }, [triggerSystemLockPopup]);

  return (
    <div className="fixed inset-0 z-[99999] bg-[#F8FAFC] flex flex-col items-center justify-center p-6 select-none">
      <div className="flex flex-col items-center text-center max-w-xs w-full space-y-5">
        <img
          src={fipMoneyLogo}
          alt={appName}
          className="h-12 w-auto object-contain"
        />

        {wasCancelled && !isAuthenticating && (
          <button
            type="button"
            onClick={triggerSystemLockPopup}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#047857] hover:bg-[#065f46] text-white font-bold text-sm shadow-lg shadow-emerald-950/15 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer border-none outline-none"
          >
            <Lock className="w-4 h-4" />
            <span>Unlock {appName}</span>
          </button>
        )}
      </div>
    </div>
  );
}
