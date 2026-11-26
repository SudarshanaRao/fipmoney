import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";
import { Capacitor } from "@capacitor/core";

const BIOMETRIC_ENABLED_KEY = "fipmoney_biometric_enabled";
const BIOMETRIC_PIN_KEY = "fipmoney_biometric_pin";

export interface BiometricCheckResult {
  isAvailable: boolean;
  biometryType?: string;
  isNative: boolean;
}

/**
 * Checks if biometric authentication hardware (Fingerprint / Face ID) is available on the device.
 * Only returns available if running natively on a mobile device (APK/iOS).
 */
export const checkBiometricAvailability = async (): Promise<BiometricCheckResult> => {
  const isNative = Capacitor.isNativePlatform();
  if (!isNative) {
    // Never trigger biometrics on the website
    return { isAvailable: false, isNative: false };
  }

  try {
    const result = await NativeBiometric.isAvailable({ useFallback: true });
    return {
      isAvailable: result.isAvailable,
      biometryType: result.biometryType ? String(result.biometryType) : "FINGERPRINT",
      isNative: true,
    };
  } catch (error) {
    console.warn("Biometric availability check failed:", error);
    return { isAvailable: false, isNative: true };
  }
};

/**
 * Prompts the user with the native Android / iOS system lock popup
 * (supports Fingerprint, Face Unlock, Pattern, PIN, or Password).
 * Only triggers if running natively in the APK.
 */
export const authenticateWithBiometrics = async (
  title = "Unlock Fipmoney",
  reason = "Verify your identity to access Fipmoney"
): Promise<{ success: boolean; error?: string }> => {
  const isNative = Capacitor.isNativePlatform();

  // If not on mobile APK (e.g. website), never trigger biometrics
  if (!isNative) {
    return { success: true };
  }

  try {
    const availability = await NativeBiometric.isAvailable({ useFallback: true });
    if (!availability.isAvailable) {
      return { success: false, error: "Screen lock or biometrics not configured on this device." };
    }

    try {
      // Primary: Android default system lock popup supporting Fingerprint, Face, PIN, Pattern & Password
      // Note: negativeButtonText must be omitted when DEVICE_CREDENTIAL is included on Android
      await NativeBiometric.verifyIdentity({
        reason,
        title,
        subtitle: "Use your device PIN, pattern, or biometrics",
        useFallback: true,
        maxAttempts: 5,
        allowedBiometryTypes: [
          BiometryType.FINGERPRINT,
          BiometryType.FACE_AUTHENTICATION,
          BiometryType.IRIS_AUTHENTICATION,
          BiometryType.DEVICE_CREDENTIAL,
        ],
      });
    } catch (primaryErr: any) {
      const msg = String(primaryErr?.message || "").toLowerCase();
      // If DEVICE_CREDENTIAL isn't supported by an older Android build, fall back to standard biometric prompt
      if (msg.includes("credential") || msg.includes("unsupported") || msg.includes("invalid")) {
        await NativeBiometric.verifyIdentity({
          reason,
          title,
          subtitle: "Verify your identity",
          negativeButtonText: "Cancel",
          maxAttempts: 5,
        });
      } else {
        throw primaryErr;
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Biometric authentication error:", error);
    return {
      success: false,
      error: error?.message || "Authentication failed or was cancelled.",
    };
  }
};

/**
 * Checks if the user enabled Biometric / Fingerprint app lock in settings.
 * Returns true ONLY if running in the mobile APK.
 */
export const isBiometricLockEnabled = (): boolean => {
  if (typeof window === "undefined") return false;
  if (!Capacitor.isNativePlatform()) return false; // NEVER trigger on website
  return localStorage.getItem(BIOMETRIC_ENABLED_KEY) === "true";
};

/**
 * Updates the user preference for Biometric / Fingerprint app lock.
 */
export const setBiometricLockEnabled = (enabled: boolean): void => {
  if (typeof window === "undefined") return;
  if (enabled) {
    localStorage.setItem(BIOMETRIC_ENABLED_KEY, "true");
  } else {
    localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
  }
};

/**
 * Gets the backup security PIN if set.
 */
export const getSecurityPin = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(BIOMETRIC_PIN_KEY);
};

/**
 * Sets a backup security PIN.
 */
export const setSecurityPin = (pin: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(BIOMETRIC_PIN_KEY, pin);
};
