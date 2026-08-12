export const getApiBaseUrl = () => {
  if (typeof window === 'undefined') return 'https://dev-server.fipmoney.com/api';
  
  const hostname = window.location.hostname;
  
  // 1. Localhost Development -> http://localhost:5000/api
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // 2. Staging / Test Environment (test.fipmoney.com) -> https://dev-server.fipmoney.com/api
  if (hostname === 'test.fipmoney.com' || hostname.includes('test.')) {
    return 'https://dev-server.fipmoney.com/api';
  }
  
  // 3. Production Environment (fipmoney.com / www.fipmoney.com) -> https://prod-server.fipmoney.com/api
  if (hostname === 'www.fipmoney.com' || hostname === 'fipmoney.com') {
    return 'https://prod-server.fipmoney.com/api';
  }
  
  return 'https://dev-server.fipmoney.com/api';
};

export const API_BASE_URL = getApiBaseUrl();
