export const getApiBaseUrl = () => {
  // Always return relative '/api' path.
  // 1. On localhost:5173 -> Inspect shows http://localhost:5173/api/... (proxied to http://localhost:5000)
  // 2. On test.fipmoney.com -> Inspect shows https://test.fipmoney.com/api/... (proxied to dev-server.fipmoney.com)
  // 3. On fipmoney.com / www.fipmoney.com -> Inspect shows https://fipmoney.com/api/... (proxied to prod-server.fipmoney.com)
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();
