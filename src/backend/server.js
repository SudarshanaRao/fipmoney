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
  'https://prod-server.fipmoney.com' // Allow Swagger UI to make requests to itself
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or requests from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
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

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/faqs', faqRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[FipMoney Backend] Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
  console.log(`[FipMoney Backend] 🔒 Secret Swagger Portal: http://localhost:${PORT}${swaggerRoute}`);
});
