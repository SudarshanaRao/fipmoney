import { Capacitor } from "@capacitor/core";
import { API_BASE_URL } from "./apiConfig";

export interface AppVersionInfo {
  latestVersion: string;
  latestVersionCode: number;
  minSupportedVersionCode: number;
  forceUpdate: boolean;
  title: string;
  description: string;
  releaseNotes: string[];
  playStoreUrl: string;
}

export const CURRENT_APP_VERSION = "1.0.5";
export const CURRENT_VERSION_CODE = 6;
export const PLAY_STORE_PACKAGE_ID = "com.fipmoney.app";
export const PLAY_STORE_MARKET_URL = `market://details?id=${PLAY_STORE_PACKAGE_ID}`;
export const PLAY_STORE_WEB_URL = `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE_ID}`;

const DISMISS_KEY = "fm_app_update_dismissed_until";

/**
 * Open the Google Play Store on Android devices or browser
 */
export const openGooglePlayStore = (customUrl?: string) => {
  const targetUrl = customUrl || PLAY_STORE_WEB_URL;
  if (Capacitor.isNativePlatform()) {
    try {
      // First attempt to open native Play Store app via market:// protocol
      window.location.href = PLAY_STORE_MARKET_URL;
      setTimeout(() => {
        window.open(targetUrl, "_blank");
      }, 500);
      return;
    } catch {
      window.open(targetUrl, "_blank");
      return;
    }
  }
  window.open(targetUrl, "_blank");
};

/**
 * Check if a new version is available on the Play Store / server
 */
export const fetchLatestAppVersion = async (): Promise<AppVersionInfo | null> => {
  // 1. Try checking backend API if available
  try {
    const apiRes = await fetch(`${API_BASE_URL}/app/version?t=${Date.now()}`, {
      headers: { "Cache-Control": "no-cache" },
    });
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && typeof data.latestVersionCode === "number") {
        return data as AppVersionInfo;
      }
    }
  } catch {
    // API endpoint might not exist, proceed to static fallback
  }

  // 2. Fallback to public/app-version.json on frontend server
  try {
    const jsonRes = await fetch(`/app-version.json?t=${Date.now()}`, {
      headers: { "Cache-Control": "no-cache" },
    });
    if (jsonRes.ok) {
      const data = await jsonRes.json();
      if (data && typeof data.latestVersionCode === "number") {
        return data as AppVersionInfo;
      }
    }
  } catch (err) {
    console.warn("Could not check app version:", err);
  }

  return null;
};

/**
 * Check if update prompt should be presented
 */
export const shouldShowUpdatePrompt = (info: AppVersionInfo, isManualCheck = false): boolean => {
  const hasNewerVersion = info.latestVersionCode > CURRENT_VERSION_CODE;
  if (!hasNewerVersion) return false;

  // Always show on manual check
  if (isManualCheck) return true;

  // If update is mandatory, ignore dismissal
  if (info.forceUpdate || info.minSupportedVersionCode > CURRENT_VERSION_CODE) {
    return true;
  }

  // Check if user dismissed recently (24 hours cooldown)
  const dismissedUntil = localStorage.getItem(DISMISS_KEY);
  if (dismissedUntil) {
    const until = parseInt(dismissedUntil, 10);
    if (!isNaN(until) && Date.now() < until) {
      return false;
    }
  }

  return true;
};

/**
 * Snooze update reminder for specified hours (default 24h)
 */
export const dismissUpdatePrompt = (hours = 24) => {
  const snoozeTime = Date.now() + hours * 60 * 60 * 1000;
  localStorage.setItem(DISMISS_KEY, snoozeTime.toString());
};

