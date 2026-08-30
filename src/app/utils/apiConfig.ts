import { Capacitor } from "@capacitor/core";

export const getApiBaseUrl = (): string => {
  // 1. Prioritize explicit environment variable (e.g. from .env: https://dev-server.fipmoney.com)
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && envApiUrl.trim() !== '') {
    const cleanUrl = envApiUrl.trim().replace(/\/$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }

  // 2. If running inside the Native Android/iOS APK, ALWAYS route to dev-server.fipmoney.com
  if (Capacitor.isNativePlatform()) {
    return 'https://dev-server.fipmoney.com/api';
  }

  // 3. If running on local developer PC browser (localhost:5173), target local backend
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }

    // 4. Test Website (www.test.fipmoney.com) -> connects to backend at dev-server.fipmoney.com
    if (hostname === 'test.fipmoney.com' || hostname === 'www.test.fipmoney.com' || hostname.includes('test.')) {
      return 'https://dev-server.fipmoney.com/api';
    }

    // 5. Production Environment
    if (hostname === 'www.fipmoney.com' || hostname === 'fipmoney.com') {
      return 'https://prod-server.fipmoney.com/api';
    }
  }

  return 'https://dev-server.fipmoney.com/api';
};

export const API_BASE_URL = getApiBaseUrl();
