export const getSwaggerLoginHtml = (swaggerRoute) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FipMoney API Portal Access</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8fafc;
      background-image: 
        radial-gradient(at 0% 0%, rgba(251, 191, 36, 0.12) 0px, transparent 40%),
        radial-gradient(at 100% 100%, rgba(245, 158, 11, 0.08) 0px, transparent 40%),
        radial-gradient(at 50% 0%, rgba(241, 245, 249, 0.8) 0px, transparent 100%);
      color: #0f172a;
      padding: 1.5rem;
    }
    .login-container {
      width: 100%;
      max-width: 420px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 1.5rem;
      padding: 2.5rem 2rem;
      box-shadow: 
        0 20px 25px -5px rgba(15, 23, 42, 0.05),
        0 8px 10px -6px rgba(15, 23, 42, 0.02),
        0 0 0 1px rgba(245, 158, 11, 0.08);
      animation: slideUp 0.35s ease-out;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .brand-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .brand-logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 1px solid #fcd34d;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
    }
    .brand-logo-icon svg {
      width: 24px;
      height: 24px;
      color: #d97706;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: #fffbeb;
      border: 1px solid #fef3c7;
      color: #b45309;
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.725rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #d97706;
    }
    .title {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      color: #0f172a;
      margin-bottom: 0.35rem;
    }
    .subtitle {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
      line-height: 1.45;
    }
    .error-banner {
      display: none;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      font-size: 0.825rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
      text-align: center;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-label {
      display: block;
      font-size: 0.775rem;
      font-weight: 700;
      color: #334155;
      margin-bottom: 0.4rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .input-wrapper {
      position: relative;
    }
    .form-input {
      width: 100%;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 0.75rem;
      padding: 0.85rem 1rem;
      color: #0f172a;
      font-size: 0.925rem;
      font-weight: 600;
      outline: none;
      transition: all 0.2s ease;
    }
    .form-input:focus {
      border-color: #f59e0b;
      background: #ffffff;
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.12);
    }
    .form-input::placeholder {
      color: #94a3b8;
      font-weight: 400;
    }
    .toggle-pass {
      position: absolute;
      right: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      font-size: 0.775rem;
      font-weight: 700;
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      transition: color 0.2s;
    }
    .toggle-pass:hover {
      color: #d97706;
      background: #fffbeb;
    }
    .btn-submit {
      width: 100%;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #ffffff;
      border: none;
      border-radius: 0.75rem;
      padding: 0.95rem;
      font-size: 0.925rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(217, 119, 6, 0.25);
      margin-top: 0.5rem;
    }
    .btn-submit:hover {
      background: linear-gradient(135deg, #fbbf24 0%, #b45309 100%);
      box-shadow: 0 6px 18px rgba(245, 158, 11, 0.35);
      transform: translateY(-1px);
    }
    .btn-submit:active {
      transform: translateY(0);
    }
    .footer-note {
      text-align: center;
      margin-top: 1.75rem;
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="brand-header">
      <div class="brand-logo-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <div class="badge">
        <span class="badge-dot"></span> Protected Documentation
      </div>
      <h1 class="title">FipMoney API Hub</h1>
      <p class="subtitle">Enter administrative credentials to unlock interactive Swagger API documentation.</p>
    </div>

    <div id="errorBanner" class="error-banner"></div>

    <form id="loginForm">
      <div class="form-group">
        <label class="form-label" for="username">Username</label>
        <input type="text" id="username" name="username" class="form-input" placeholder="e.g. admin" required autocomplete="off">
      </div>

      <div class="form-group">
        <label class="form-label" for="password">Password</label>
        <div class="input-wrapper">
          <input type="password" id="password" name="password" class="form-input" placeholder="••••••••••••" required>
          <button type="button" id="togglePass" class="toggle-pass">Show</button>
        </div>
      </div>

      <button type="submit" id="submitBtn" class="btn-submit">
        Access Swagger Docs
      </button>
    </form>

    <div class="footer-note">
      🔒 Secure Development Environment • FipMoney API
    </div>
  </div>

  <script>
    const loginForm = document.getElementById('loginForm');
    const errorBanner = document.getElementById('errorBanner');
    const submitBtn = document.getElementById('submitBtn');
    const passwordInput = document.getElementById('password');
    const togglePass = document.getElementById('togglePass');

    togglePass.addEventListener('click', () => {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePass.textContent = 'Hide';
      } else {
        passwordInput.type = 'password';
        togglePass.textContent = 'Show';
      }
    });

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorBanner.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Authenticating...';

      const username = document.getElementById('username').value.trim();
      const password = passwordInput.value;

      try {
        const response = await fetch('${swaggerRoute}/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          window.location.reload();
        } else {
          errorBanner.textContent = data.message || 'Invalid username or password';
          errorBanner.style.display = 'block';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Access Swagger Docs';
        }
      } catch (err) {
        errorBanner.textContent = 'Network error. Please try again.';
        errorBanner.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Access Swagger Docs';
      }
    });
  </script>
</body>
</html>
`;
