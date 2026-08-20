import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db.js';
import swaggerSpec from './config/swagger.js';
import { getSwaggerLoginHtml } from './config/swaggerLoginHtml.js';
import healthRoutes from './routes/healthRoutes.js';
import userRoutes from './routes/userRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Try loading from current working directory (usually root)
dotenv.config();
// Also explicitly load from the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to Database
connectDB();

const app = express();

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://fipmoney.com',
  'https://www.fipmoney.com',
  'https://test.fipmoney.com',
  'http://test.fipmoney.com',
  'https://dev-server.fipmoney.com',
  'http://dev-server.fipmoney.com',
  'https://prod-server.fipmoney.com',
  'http://prod-server.fipmoney.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Dynamically allow any origin to bypass strict matching issues
    callback(null, origin || true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FipMoney API Server',
    version: '1.0.0',
    healthCheck: '/api/health',
  });
});

// Secret Obfuscated Swagger Route Configuration
const secretSwaggerPath = process.env.SWAGGER_SECRET_PATH || 'docs-sec-9f8a3d7b2c';
const swaggerRoute = secretSwaggerPath.startsWith('/') ? secretSwaggerPath : `/${secretSwaggerPath}`;
const AUTH_COOKIE_NAME = 'swagger_session';
const AUTH_COOKIE_TOKEN = 'auth_token_secret_fipmoney_2026';

// Helper function to check if request has valid session cookie
const isSwaggerAuthenticated = (req) => {
  const cookieHeader = req.headers.cookie || '';
  return cookieHeader.includes(`${AUTH_COOKIE_NAME}=${AUTH_COOKIE_TOKEN}`);
};

// 1. POST Login Endpoint
app.post(`${swaggerRoute}/login`, (req, res) => {
  const { username, password } = req.body;
  const expectedUser = process.env.SWAGGER_USER || 'admin';
  const expectedPass = process.env.SWAGGER_PASS || 'Admin@fipmoney.com';

  if (username === expectedUser && password === expectedPass) {
    // Set httpOnly session cookie
    res.setHeader(
      'Set-Cookie',
      `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    );
    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password. Access Denied.',
    });
  }
});

// 2. GET Logout Endpoint
app.get(`${swaggerRoute}/logout`, (req, res) => {
  res.setHeader(
    'Set-Cookie',
    `${AUTH_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );
  res.redirect(swaggerRoute);
});

// 3. Custom Middleware: Serve Custom Login Portal or Swagger UI
const swaggerAuthGuard = (req, res, next) => {
  if (isSwaggerAuthenticated(req)) {
    return next();
  }
  // Return custom-designed HTML modal login portal if not authenticated
  res.status(200).send(getSwaggerLoginHtml(swaggerRoute));
};

// Custom CSS for Swagger UI header logout button
const customCss = `
  .swagger-ui .topbar { background-color: #0f172a; border-bottom: 2px solid #f59e0b; }
  .swagger-ui .topbar-wrapper img { content: url('https://img.icons8.com/color/48/gold-bars.png'); height: 36px; }
  .swagger-ui .topbar-wrapper .link span { color: #fbbf24; font-weight: 800; font-size: 1.1rem; }
  .logout-btn-swagger {
    margin-left: auto;
    background: #ef4444;
    color: white;
    padding: 6px 14px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.8rem;
    transition: background 0.2s;
  }
  .logout-btn-swagger:hover { background: #dc2626; color: white; }
`;

const customJs = `
  window.addEventListener('DOMContentLoaded', () => {
    const topbar = document.querySelector('.swagger-ui .topbar-wrapper');
    if (topbar && !document.getElementById('swaggerLogoutBtn')) {
      const logoutBtn = document.createElement('a');
      logoutBtn.id = 'swaggerLogoutBtn';
      logoutBtn.href = '${swaggerRoute}/logout';
      logoutBtn.className = 'logout-btn-swagger';
      logoutBtn.innerText = '🔒 Lock / Logout';
      topbar.appendChild(logoutBtn);
    }
  });
`;

// Mount Obfuscated Secret Swagger Route with Custom Login Guard
app.use(
  swaggerRoute,
  swaggerAuthGuard,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'FipMoney Secure API Documentation',
    customCss: customCss,
    customJsStr: customJs,
  })
);

// Block Standard Common Swagger Paths (Return 404 so scanners cannot find docs)
['/swagger', '/api-docs', '/docs', '/swagger-ui'].forEach((path) => {
  app.get(path, (req, res) => {
    res.status(404).json({ message: 'Route Not Found' });
  });
});

import emailRoutes from './routes/emailRoutes.js';
import emailTemplateRoutes from './routes/emailTemplateRoutes.js';
import agentWaitlistRoutes from './routes/agentWaitlistRoutes.js';
import kycRoutes from './routes/kycRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { exchangeGrantCodeForTokens, campaignHtmlStore } from './utils/zohoCampaignsService.js';

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/email-templates', emailTemplateRoutes);
app.use('/api/agent-waitlist', agentWaitlistRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/referrals', referralRoutes);

// Direct Top-Level Zoho OAuth Callback Handler (Guarantees zero 404s on dev-server.fipmoney.com)
app.get('/api/admin/zoho-oauth/callback', async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;

  if (error || !code) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Zoho Connection Failed</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #e11d48;">❌ Zoho OAuth Authorization Failed</h2>
          <p style="color: #64748b;">Reason: ${error || 'No authorization code received'}</p>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6d28d9; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Close Window</button>
        </body>
      </html>
    `);
  }

  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host') || 'dev-server.fipmoney.com';
  const redirectUri = `${proto}://${host}${req.path}`;

  try {
    const result = await exchangeGrantCodeForTokens(code, redirectUri);

    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Zoho Connection Successful</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f8fafc;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
            <h2 style="color: #10b981; margin-bottom: 10px;">🎉 Zoho Campaigns Connected!</h2>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              Fipmoney has successfully generated and saved your permanent <strong>Zoho Campaigns Refresh Token</strong>.
            </p>
            <div style="background: #f1f5f9; padding: 12px; border-radius: 10px; font-family: monospace; font-size: 12px; word-break: break-all; margin: 20px 0; color: #475569;">
              Token: ${result.refreshToken.slice(0, 15)}...${result.refreshToken.slice(-10)}
            </div>
            <button onclick="if(window.opener){window.opener.location.reload();} window.close();" style="padding: 12px 24px; background: #6d28d9; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 14px;">
              Return to Admin Dashboard
            </button>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Zoho OAuth Error</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8fafc;">
          <div style="max-width: 550px; margin: 0 auto; background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
            <h2 style="color: #e11d48; margin-bottom: 10px;">❌ Token Exchange Error</h2>
            <div style="background: #fff1f2; border: 1px solid #fecdd3; padding: 12px; border-radius: 10px; font-family: monospace; font-size: 13px; color: #9f1239; margin: 15px 0;">
              ${err.message}
            </div>
            <p style="color: #64748b; font-size: 13px;">
              <strong>Note:</strong> Zoho authorization codes can only be used <strong>once</strong>. If you reloaded the page or re-used an old link, please click <em>Authorize</em> again to generate a new code.
            </p>
            <button onclick="window.close()" style="padding: 12px 24px; background: #6d28d9; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer;">Close Window</button>
          </div>
        </body>
      </html>
    `);
  }
});

app.get('/api/admin/zoho-oauth/campaign-content/:contentId', (req, res) => {
  const html = campaignHtmlStore.get(req.params.contentId);
  if (!html) {
    return res.status(404).send('<!DOCTYPE html><html><body><h1>Campaign Content Expired or Not Found</h1></body></html>');
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[FipMoney Backend] Zoho ZeptoMail Server running on http://localhost:${PORT}`);
  console.log(`[FipMoney Backend] 🔒 Secret Swagger Portal: http://localhost:${PORT}${swaggerRoute}`);
});
