const get404HtmlPage = (requestedUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Page Not Found | FipMoney</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #090d16 0%, #111827 50%, #1e1b4b 100%);
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
    }
    .card {
      max-width: 480px;
      width: 100%;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 28px;
      padding: 48px 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(216, 146, 33, 0.15);
      border: 1px solid rgba(216, 146, 33, 0.3);
      color: #fbbf24;
      padding: 6px 16px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 24px;
    }
    .error-code {
      font-size: 72px;
      font-weight: 900;
      line-height: 1;
      background: linear-gradient(135deg, #fbbf24 0%, #d89221 50%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
    }
    h1 { font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 12px; }
    p { font-size: 14px; color: #94a3b8; font-weight: 500; line-height: 1.6; margin-bottom: 24px; }
    .path-code {
      display: inline-block;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      font-family: monospace;
      font-size: 13px;
      padding: 6px 12px;
      border-radius: 8px;
      word-break: break-all;
      margin-bottom: 28px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 14px 28px;
      background: linear-gradient(135deg, #d89221 0%, #b47517 100%);
      color: #ffffff;
      font-weight: 800;
      font-size: 14px;
      border-radius: 16px;
      text-decoration: none;
      box-shadow: 0 10px 25px -5px rgba(216, 146, 33, 0.4);
      transition: all 0.2s ease;
    }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 15px 30px -5px rgba(216, 146, 33, 0.5); }
    .footer { margin-top: 32px; font-size: 12px; color: #64748b; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🔒 FipMoney Secure Platform</div>
    <div class="error-code">404</div>
    <h1>Page Not Found</h1>
    <p>The endpoint or page you are looking for does not exist or has been relocated.</p>
    <div class="path-code">${requestedUrl}</div>
    <a href="https://www.test.fipmoney.com" class="btn">Return to FipMoney App</a>
  </div>
  <div class="footer">© 2026 FipMoney. All rights reserved.</div>
</body>
</html>
`;

export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log error (suppress excessive log noise for standard 404s)
  if (statusCode !== 404) {
    console.error(`[Error ${statusCode}] ${err.message}`);
  }

  // All API requests MUST return JSON responses, never HTML
  const isApiRoute = req.originalUrl.startsWith('/api') || req.path.startsWith('/api');
  const prefersJson = !req.accepts('html') || (req.headers.accept && req.headers.accept.includes('application/json'));

  if (isApiRoute || prefersJson) {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      statusCode: statusCode,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }

  // Serve custom HTML page only for direct non-API browser navigation
  return res.status(statusCode).send(get404HtmlPage(req.originalUrl));
};
