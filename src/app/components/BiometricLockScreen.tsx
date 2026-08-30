"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Lock, ShieldCheck, KeyRound, AlertCircle, ArrowRight } from "lucide-react";
import { authenticateWithBiometrics, getSecurityPin } from "../utils/biometricService";

interface BiometricLockScreenProps {
  onUnlock: () => void;
  appName?: string;
}

export default function BiometricLockScreen({
  onUnlock,
  appName = "Fipmoney",
}: BiometricLockScreenProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPinFallback, setShowPinFallback] = useState(false);
  const [pinInput, setPinInput] = useState("");

  const triggerBiometricPrompt = async () => {
    setIsAuthenticating(true);
    setErrorMessage(null);

    try {
      const result = await authenticateWithBiometrics(
        `${appName} Security`,
        "Place your finger on the sensor to unlock Fipmoney"
      );

      if (result.success) {
        onUnlock();
      } else {
        if (result.error && !result.error.toLowerCase().includes("cancel")) {
          setErrorMessage(result.error || "Authentication failed. Please try again.");
        }
      }
    } catch (err) {
      setErrorMessage("Could not verify identity. You can use your PIN fallback.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Trigger prompt automatically on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerBiometricPrompt();
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = getSecurityPin() || "1234"; // Default backup or user set
    if (pinInput === storedPin) {
      onUnlock();
    } else {
      setErrorMessage("Incorrect PIN. Please try again.");
      setPinInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white flex flex-col items-center justify-between p-6 select-none">
      {/* Top Branding */}
      <div className="w-full pt-8 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ffbf00] to-[#ffd152] flex items-center justify-center shadow-lg shadow-[#ffbf00]/20 mb-4"
        >
          <Lock className="w-8 h-8 text-black" />
        </motion.div>

        <h1 className="text-2xl font-bold tracking-tight text-white">{appName} Locked</h1>
        <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Biometric Protection Active
        </p>
      </div>

      {/* Main Fingerprint Sensor Interaction Area */}
      <div className="w-full max-w-sm flex flex-col items-center my-auto">
        <AnimatePresence mode="wait">
          {!showPinFallback ? (
            <motion.div
              key="biometric-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col items-center w-full"
            >
              {/* Pulsing Fingerprint Icon Button */}
              <div className="relative my-8">
                <motion.div
                  animate={{
                    scale: [1, 1.18, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ffbf00]/30 to-[#ffd152]/30 blur-xl"
                />

                <button
                  type="button"
                  onClick={triggerBiometricPrompt}
                  disabled={isAuthenticating}
                  className="relative w-28 h-28 rounded-full bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-[#ffbf00]/40 flex items-center justify-center active:scale-95 transition-transform shadow-2xl hover:border-[#ffbf00]"
                >
                  <Fingerprint className={`w-14 h-14 ${isAuthenticating ? "text-[#ffd152] animate-pulse" : "text-[#ffbf00]"}`} />
                </button>
              </div>

              <p className="text-gray-300 text-sm font-medium mb-1">
                Touch fingerprint sensor
              </p>
              <p className="text-gray-500 text-xs mb-6 text-center">
                Tap the sensor icon if the prompt does not appear automatically
              </p>

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs mb-4 max-w-xs text-center"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              <button
                type="button"
                onClick={() => setShowPinFallback(true)}
                className="text-xs text-gray-400 hover:text-[#ffbf00] flex items-center gap-1.5 transition-colors pt-2"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Use Security PIN instead
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="pin-view"
              onSubmit={handlePinSubmit}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col items-center w-full"
            >
              <div className="w-14 h-14 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center mb-4">
                <KeyRound className="w-7 h-7 text-[#ffbf00]" />
              </div>

              <h2 className="text-lg font-semibold mb-1">Enter Security PIN</h2>
              <p className="text-xs text-gray-400 mb-6 text-center">
                Enter your 4-digit backup PIN to unlock
              </p>

              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                autoFocus
                className="w-48 text-center text-2xl tracking-[0.4em] py-3 px-4 bg-gray-800/90 border border-gray-700 rounded-xl focus:outline-none focus:border-[#ffbf00] text-white mb-4"
              />

              {errorMessage && (
                <div className="text-red-400 text-xs mb-4 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errorMessage}
                </div>
              )}

              <div className="flex items-center gap-3 w-full max-w-xs mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPinFallback(false);
                    setErrorMessage(null);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gray-800 text-gray-300 text-xs font-medium hover:bg-gray-700 transition-colors"
                >
                  Back to Fingerprint
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#ffbf00] text-gray-950 text-xs font-semibold hover:bg-[#ffd152] transition-colors flex items-center justify-center gap-1"
                >
                  Unlock
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Footer */}
      <div className="w-full text-center pb-4 text-xs text-gray-600">
        Secured with Bank-Grade Hardware Encryption
      </div>
    </div>
  );
}
