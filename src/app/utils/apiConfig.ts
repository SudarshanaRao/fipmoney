export const getApiBaseUrl = () => {
  if (typeof window === 'undefined') return '/api';
  
  const hostname = window.location.hostname;
  
  // 1. Localhost Development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return '/api';
  }
  
  // 2. Staging / Test Environment (test.fipmoney.com -> dev-server.fipmoney.com)
  if (hostname === 'test.fipmoney.com' || hostname.includes('test.')) {
    return 'https://dev-server.fipmoney.com/api';
  }
  
  // 3. Production Environment (fipmoney.com / www.fipmoney.com -> prod-server.fipmoney.com)
  if (hostname === 'www.fipmoney.com' || hostname === 'fipmoney.com') {
    return 'https://prod-server.fipmoney.com/api';
  }
  
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();
