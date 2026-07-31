export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // In production, we must use the absolute URL because shared hosting (Hostinger) disables reverse proxying via .htaccess
    if (hostname.includes('fipmoney.com') || hostname.includes('test.fipmoney.com')) {
      return 'https://prod-server.fipmoney.com/api';
    }
  }
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();
