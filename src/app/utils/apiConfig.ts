export const getApiBaseUrl = () => {
  if (typeof window === 'undefined') return '/api';
  
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return '/api';
  } else if (hostname === 'test.fipmoney.com' || hostname.includes('test.')) {
    // Development/Staging environment relative API endpoint
    return '/api';
  } else if (hostname === 'www.fipmoney.com' || hostname === 'fipmoney.com') {
    // Production environment relative API endpoint
    return '/api';
  }
  
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();
