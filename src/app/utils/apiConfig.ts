export const getApiBaseUrl = () => {
  if (typeof window === 'undefined') return '/api';
  
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Rely on Vite proxy or local server routing
    return '/api';
  } else if (hostname === 'test.fipmoney.com') {
    // Development/Staging environment backend
    return 'https://dev-server.fipmoney.com/api';
  } else if (hostname === 'www.fipmoney.com' || hostname === 'fipmoney.com') {
    // Production environment backend
    return 'https://prod-server.fipmoney.com/api';
  }
  
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();
