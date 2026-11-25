import os
import io
import base64
import subprocess
from PIL import Image

output_dir = os.path.abspath('google_play_assets')
os.makedirs(output_dir, exist_ok=True)

def get_cropped_b64(path):
    if not os.path.exists(path):
        return ""
    im = Image.open(path)
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    buf = io.BytesIO()
    im.save(buf, format='PNG')
    return f"data:image/png;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"

def get_raw_b64(path, fmt='png'):
    if not os.path.exists(path):
        return ""
    with open(path, 'rb') as f:
        return f"data:image/{fmt};base64,{base64.b64encode(f.read()).decode('utf-8')}"

logo_data = get_cropped_b64('public/fipmoney_logo_final.png')
vault_data = get_cropped_b64('public/login_image.png')
daily_savings_data = get_cropped_b64('public/daily_savings.png')

# -------------------------------------------------------------
# TEMPLATE 1: FLAGSHIP DEEP EMERALD & 3D GOLD VAULT
# -------------------------------------------------------------
html_flagship = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');
  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}
  body {{
    width: 1024px;
    height: 500px;
    overflow: hidden;
    background: #022c22;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #ffffff;
    -webkit-font-smoothing: antialiased;
  }}
  .canvas {{
    position: relative;
    width: 1024px;
    height: 500px;
    background: 
      radial-gradient(circle 440px at 76% 48%, rgba(251, 199, 64, 0.17) 0%, transparent 70%),
      radial-gradient(circle 380px at 45% 85%, rgba(4, 120, 87, 0.35) 0%, transparent 70%),
      radial-gradient(circle 500px at 15% 15%, rgba(5, 150, 105, 0.25) 0%, transparent 60%),
      linear-gradient(135deg, #011f18 0%, #022c22 35%, #064e3b 75%, #047857 100%);
    overflow: hidden;
    display: flex;
    padding: 42px 54px;
  }}

  /* Background Grid Overlay */
  .grid-pattern {{
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 36px 36px;
    pointer-events: none;
    mask-image: radial-gradient(circle at 50% 50%, black 40%, transparent 90%);
    -webkit-mask-image: radial-gradient(circle at 50% 50%, black 40%, transparent 90%);
  }}

  /* Subtle Gold Sparkles */
  .sparkle {{
    position: absolute;
    color: #FBC740;
    opacity: 0.6;
    font-size: 14px;
  }}

  /* Left Content */
  .left-col {{
    width: 520px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  .header-brand {{
    display: flex;
    align-items: center;
    gap: 12px;
  }}
  .logo-img {{
    height: 46px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
  }}
  .brand-title {{
    font-size: 30px;
    font-weight: 900;
    letter-spacing: -0.5px;
    color: #ffffff;
    display: flex;
    align-items: center;
  }}
  .brand-title span {{
    color: #FBC740;
  }}
  .badge-tag {{
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(251, 199, 64, 0.12);
    border: 1px solid rgba(251, 199, 64, 0.4);
    color: #FBC740;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 999px;
    white-space: nowrap;
    margin-left: 6px;
  }}

  .headline-block {{
    margin-top: 10px;
  }}
  .main-h1 {{
    font-size: 43px;
    font-weight: 900;
    line-height: 1.08;
    letter-spacing: -1px;
    color: #ffffff;
  }}
  .gold-gradient-text {{
    background: linear-gradient(135deg, #FFF6D1 0%, #FDE074 35%, #FBC740 65%, #E5A812 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }}
  .sub-copy {{
    margin-top: 14px;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.45;
    color: rgba(236, 253, 245, 0.88);
    max-width: 490px;
  }}

  /* Trust Badges Row */
  .trust-row {{
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
  }}
  .trust-pill {{
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 12px;
    padding: 8px 12px;
    font-size: 11px;
    font-weight: 700;
    color: #ffffff;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    white-space: nowrap;
  }}
  .trust-pill svg {{
    width: 15px;
    height: 15px;
    stroke: #FBC740;
    flex-shrink: 0;
  }}

  /* Right Visual */
  .right-col {{
    position: absolute;
    right: 28px;
    top: 20px;
    bottom: 20px;
    width: 460px;
    display: flex;
    align-items: center;
    justify-content: center;
  }}
  .vault-img {{
    width: 420px;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 25px 35px rgba(0,0,0,0.55)) drop-shadow(0 0 45px rgba(251, 199, 64, 0.3));
    z-index: 5;
    transform: translateX(10px);
  }}

  /* Floating Metric Card */
  .float-metric {{
    position: absolute;
    bottom: 20px;
    left: 20px;
    background: rgba(6, 78, 59, 0.94);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(251, 199, 64, 0.5);
    border-radius: 16px;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);
    z-index: 20;
    white-space: nowrap;
  }}
  .metric-icon {{
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: linear-gradient(135deg, #FBC740, #D97706);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #022c22;
    font-weight: 900;
    font-size: 16px;
  }}
  .metric-label {{
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 0.5px;
  }}
  .metric-val {{
    font-size: 14px;
    font-weight: 900;
    color: #ffffff;
  }}
  .metric-val span {{
    color: #FBC740;
  }}

  /* Top Right Security Ribbon */
  .top-right-badge {{
    position: absolute;
    top: 24px;
    right: 28px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(251, 199, 64, 0.4);
    border-radius: 999px;
    padding: 6px 15px;
    font-size: 11px;
    font-weight: 800;
    color: #FBC740;
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 25;
  }}
</style>
</head>
<body>
  <div class="canvas">
    <div class="grid-pattern"></div>
    <div class="sparkle" style="top: 36px; left: 470px;">✦</div>
    <div class="sparkle" style="top: 210px; left: 510px; font-size: 18px;">✦</div>
    <div class="sparkle" style="bottom: 70px; left: 35px; font-size: 12px;">✦</div>

    <div class="left-col">
      <!-- Brand & Tag -->
      <div class="header-brand">
        <img src="{logo_data}" class="logo-img" alt="Logo" />
        <div class="brand-title">Fip<span>Money</span></div>
        <div class="badge-tag">✦ 24K Pure Gold & Silver</div>
      </div>

      <!-- Main Headline -->
      <div class="headline-block">
        <h1 class="main-h1">
          Smart Savings in<br/>
          <span class="gold-gradient-text">24K Pure Digital Gold.</span>
        </h1>
        <p class="sub-copy">
          Automate micro-savings with Daily, Weekly & Monthly Gold SIP from just ₹10. 100% insured vault storage with instant buy & sell anytime.
        </p>
      </div>

      <!-- Trust Badges -->
      <div class="trust-row">
        <div class="trust-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          <span>100% Insured (Bank-Grade)</span>
        </div>
        <div class="trust-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>99.99% Purity</span>
        </div>
        <div class="trust-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Instant Liquidity</span>
        </div>
      </div>
    </div>

    <!-- Right 3D Visual -->
    <div class="right-col">
      <div class="top-right-badge">
        <span>🔒 Bank-Grade Security</span>
      </div>
      <img src="{vault_data}" class="vault-img" alt="3D Gold Safe" />
      <div class="float-metric">
        <div class="metric-icon">₹</div>
        <div>
          <div class="metric-label">Automated Micro-SIP</div>
          <div class="metric-val">Start from <span>₹10 / day</span></div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
"""

# -------------------------------------------------------------
# TEMPLATE 2: MODERN CLEAN WHITE & EMERALD GOLD SIP
# -------------------------------------------------------------
html_clean = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');
  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}
  body {{
    width: 1024px;
    height: 500px;
    overflow: hidden;
    background: #ffffff;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #0f172a;
    -webkit-font-smoothing: antialiased;
  }}
  .canvas {{
    position: relative;
    width: 1024px;
    height: 500px;
    background: 
      radial-gradient(circle 480px at 85% 50%, rgba(209, 250, 229, 0.7) 0%, transparent 70%),
      radial-gradient(circle 350px at 10% 90%, rgba(254, 243, 199, 0.6) 0%, transparent 60%),
      linear-gradient(135deg, #ffffff 0%, #f8fafc 45%, #ecfdf5 100%);
    overflow: hidden;
    display: flex;
    padding: 42px 54px;
    border: 1px solid #e2e8f0;
  }}

  .sparkle {{
    position: absolute;
    color: #047857;
    opacity: 0.5;
    font-size: 14px;
  }}

  .left-col {{
    width: 530px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  .header-brand {{
    display: flex;
    align-items: center;
    gap: 12px;
  }}
  .logo-img {{
    height: 46px;
    width: auto;
    object-fit: contain;
  }}
  .brand-title {{
    font-size: 30px;
    font-weight: 900;
    letter-spacing: -0.5px;
    color: #0f172a;
  }}
  .brand-title span {{
    color: #047857;
  }}
  .badge-tag {{
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #065f46;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 999px;
    white-space: nowrap;
    margin-left: 6px;
  }}

  .headline-block {{
    margin-top: 10px;
  }}
  .main-h1 {{
    font-size: 43px;
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -1px;
    color: #0f172a;
  }}
  .emerald-text {{
    color: #047857;
  }}
  .sub-copy {{
    margin-top: 14px;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.45;
    color: #475569;
    max-width: 480px;
  }}

  /* Plans Pill Row */
  .plans-row {{
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 8px;
  }}
  .plan-card {{
    background: #ffffff;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    min-width: 120px;
  }}
  .plan-card.active {{
    border-color: #047857;
    background: #f0fdf4;
  }}
  .plan-tag {{
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    color: #047857;
    letter-spacing: 0.5px;
  }}
  .plan-title {{
    font-size: 13px;
    font-weight: 800;
    color: #0f172a;
    margin-top: 2px;
  }}
  .plan-amount {{
    font-size: 11.5px;
    font-weight: 700;
    color: #64748b;
  }}

  .right-col {{
    position: absolute;
    right: 28px;
    top: 20px;
    bottom: 20px;
    width: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
  }}
  .calendar-img {{
    width: 410px;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 20px 30px rgba(0,0,0,0.18));
  }}

  .badge-security {{
    position: absolute;
    bottom: 22px;
    left: -10px;
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 16px;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 12px 28px rgba(0,0,0,0.08);
    white-space: nowrap;
  }}
  .security-icon {{
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: #fef3c7;
    color: #d97706;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
  }}
  .sec-title {{
    font-size: 12.5px;
    font-weight: 800;
    color: #0f172a;
  }}
  .sec-sub {{
    font-size: 10.5px;
    font-weight: 600;
    color: #059669;
  }}
</style>
</head>
<body>
  <div class="canvas">
    <div class="sparkle" style="top: 36px; left: 470px;">✦</div>
    <div class="sparkle" style="top: 220px; left: 510px;">✦</div>

    <div class="left-col">
      <div class="header-brand">
        <img src="{logo_data}" class="logo-img" alt="Logo" />
        <div class="brand-title">Fip<span>Money</span></div>
        <div class="badge-tag">✦ Daily Gold SIP</div>
      </div>

      <div class="headline-block">
        <h1 class="main-h1">
          Start Small. Build Wealth.<br/>
          <span class="emerald-text">Automate with Gold SIP.</span>
        </h1>
        <p class="sub-copy">
          Choose a savings plan that fits your lifestyle. Invest in 24K 99.99% pure digital gold automatically with bank-grade security.
        </p>
      </div>

      <div class="plans-row">
        <div class="plan-card active">
          <span class="plan-tag">✦ Most Popular</span>
          <span class="plan-title">Daily Savings</span>
          <span class="plan-amount">₹10 / day</span>
        </div>
        <div class="plan-card">
          <span class="plan-tag">✦ Steady Growth</span>
          <span class="plan-title">Weekly Savings</span>
          <span class="plan-amount">₹1,000 / week</span>
        </div>
        <div class="plan-card">
          <span class="plan-tag">✦ Wealth Builder</span>
          <span class="plan-title">Monthly SIP</span>
          <span class="plan-amount">₹5,000 / month</span>
        </div>
      </div>
    </div>

    <div class="right-col">
      <img src="{daily_savings_data}" class="calendar-img" alt="SIP Calendar" />
      <div class="badge-security">
        <div class="security-icon">🛡️</div>
        <div>
          <div class="sec-title">24K Pure Digital Gold</div>
          <div class="sec-sub">✓ 99.99% Purity • 100% Insured Vaults</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
"""

with open(os.path.join(output_dir, 'flagship.html'), 'w', encoding='utf-8') as f:
    f.write(html_flagship)

with open(os.path.join(output_dir, 'clean.html'), 'w', encoding='utf-8') as f:
    f.write(html_clean)

print("Updated HTML templates with refined layout.")
