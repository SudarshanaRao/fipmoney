import { NativeBiometric } from "@capgo/capacitor-native-biometric";
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
 */
export const checkBiometricAvailability = async (): Promise<BiometricCheckResult> => {
  const isNative = Capacitor.isNativePlatform();
  if (!isNative) {
    // In web browser preview, simulate available or check WebAuthn support
    return { isAvailable: true, biometryType: "FINGERPRINT", isNative: false };
  }

  try {
    const result = await NativeBiometric.isAvailable();
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
 * Prompts the user with the native Fingerprint / Face ID prompt.
 */
export const authenticateWithBiometrics = async (
  title = "Fipmoney Security",
  reason = "Scan your fingerprint to access Fipmoney"
): Promise<{ success: boolean; error?: string }> => {
  const isNative = Capacitor.isNativePlatform();

  if (!isNative) {
    // Simulated authentication for browser preview
    return { success: true };
  }

  try {
    const availability = await NativeBiometric.isAvailable();
    if (!availability.isAvailable) {
      return { success: false, error: "Biometrics not available or not enrolled on this device." };
    }

    await NativeBiometric.verifyIdentity({
      reason,
      title,
      subtitle: "Biometric Authentication",
      description: "Touch the fingerprint sensor to continue",
      negativeButtonText: "Use PIN",
      maxAttempts: 3,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Biometric authentication error:", error);
    return {
      success: false,
      error: error?.message || "Biometric authentication failed or was cancelled.",
    };
  }
};

/**
 * Checks if the user enabled Biometric / Fingerprint app lock in settings.
 */
export const isBiometricLockEnabled = (): boolean => {
  if (typeof window === "undefined") return false;
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
