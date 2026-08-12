export const getApiBaseUrl = (): string => {
  // 1. Prioritize import.meta.env.VITE_API_URL if configured
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && envApiUrl.trim() !== '') {
    const cleanUrl = envApiUrl.trim().replace(/\/$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }

  if (typeof window === 'undefined') return 'https://www.test.fipmoney.com/api';
  
  const hostname = window.location.hostname;
  
  // 2. Localhost Development -> http://localhost:5000/api
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // 3. Staging / Test Environment (test.fipmoney.com / www.test.fipmoney.com) -> https://www.test.fipmoney.com/api
  if (hostname === 'test.fipmoney.com' || hostname === 'www.test.fipmoney.com' || hostname.includes('test.')) {
    return 'https://www.test.fipmoney.com/api';
  }
  
  // 4. Production Environment (fipmoney.com / www.fipmoney.com) -> https://www.fipmoney.com/api
  if (hostname === 'www.fipmoney.com' || hostname === 'fipmoney.com') {
    return 'https://www.fipmoney.com/api';
  }
  
  return 'https://www.test.fipmoney.com/api';
};

export const API_BASE_URL = getApiBaseUrl();
