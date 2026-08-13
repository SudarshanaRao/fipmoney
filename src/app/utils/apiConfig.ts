export const getApiBaseUrl = (): string => {
  // 1. If running on localhost or 127.0.0.1 in browser, ALWAYS target local backend on http://localhost:5000/api
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
  }

  // 2. Prioritize import.meta.env.VITE_API_URL for custom build pipelines
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && envApiUrl.trim() !== '') {
    const cleanUrl = envApiUrl.trim().replace(/\/$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }

  if (typeof window === 'undefined') return 'https://www.test.fipmoney.com/api';
  
  const hostname = window.location.hostname;
  
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
