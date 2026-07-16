Yes. For this design, I’d build it as a responsive React component structure, not as one giant image. The generated financial scene itself will need to be used as a background/illustration asset if you want the closest visual match; the form, logo, cards, navigation, trust sections, and responsive behavior should be real HTML/CSS.

Below is a complete implementation using React + Vite + Lucide React.

1. Install dependency
npm install lucide-react
2. Recommended structure
src/
├── assets/
│   └── fipmoney-financial-scene.png
├── components/
│   ├── AuthPage.jsx
│   ├── BrandLogo.jsx
│   ├── FinancialScene.jsx
│   ├── FloatingCard.jsx
│   ├── LoginForm.jsx
│   └── TrustBar.jsx
├── App.jsx
├── main.jsx
└── styles/
    └── auth.css
3. App.jsx
import AuthPage from "./components/AuthPage";
import "./styles/auth.css";

function App() {
  return <AuthPage />;
}

export default App;
4. components/AuthPage.jsx
import { Headphones, ChevronDown } from "lucide-react";

import BrandLogo from "./BrandLogo";
import FinancialScene from "./FinancialScene";
import LoginForm from "./LoginForm";

const AuthPage = () => {
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <header className="auth-header">
          <BrandLogo />

          <div className="header-actions">
            <button className="help-button">
              <Headphones size={22} strokeWidth={1.8} />
              <span>Need help?</span>
            </button>

            <button className="language-button">
              <span>EN</span>
              <ChevronDown size={18} />
            </button>
          </div>
        </header>

        <div className="auth-content">
          <FinancialScene />

          <section className="login-section">
            <LoginForm />
          </section>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
5. components/BrandLogo.jsx
const BrandLogo = () => {
  return (
    <div className="brand-logo">
      <div className="brand-symbol">
        <span>F</span>
        <span>M</span>
      </div>

      <div className="brand-copy">
        <h1>FipMoney</h1>
        <p>Money, made smarter.</p>
      </div>
    </div>
  );
};

export default BrandLogo;
6. components/FloatingCard.jsx
const FloatingCard = ({
  className = "",
  icon,
  title,
  children,
}) => {
  return (
    <article className={`floating-card ${className}`}>
      <div className="floating-card-header">
        {icon && <div className="floating-icon">{icon}</div>}

        <span>{title}</span>
      </div>

      <div className="floating-card-content">
        {children}
      </div>
    </article>
  );
};

export default FloatingCard;
7. components/FinancialScene.jsx
import {
  ArrowUpRight,
  LockKeyhole,
  WalletCards,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
} from "lucide-react";

import FloatingCard from "./FloatingCard";
import TrustBar from "./TrustBar";

const FinancialScene = () => {
  return (
    <section className="financial-section">
      <div className="financial-background" />

      <div className="financial-copy">
        <h2>
          One number.
          <br />
          Your complete
          <br />
          <span>financial world.</span>
        </h2>

        <p>Smart spending. Secure payments.</p>

        <strong>Track. Save. Grow.</strong>
      </div>

      <div className="scene-center">
        <div className="gateway gateway-one" />
        <div className="gateway gateway-two" />

        <div className="phone-device">
          <div className="phone-speaker" />

          <div className="phone-screen">
            <span>Welcome to</span>

            <div className="phone-logo">FM</div>

            <strong>FipMoney</strong>
          </div>
        </div>

        <div className="credit-card">
          <div className="card-logo">FM</div>

          <div className="card-contactless">)))</div>

          <div className="card-chip" />

          <div className="card-number">
            1234&nbsp;&nbsp;5678&nbsp;&nbsp;9012&nbsp;&nbsp;3456
          </div>
        </div>

        <div className="rupee-symbol">₹</div>

        <div className="coins">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <FloatingCard
        className="spending-card"
        title="Smart Spending"
        icon={<TrendingUp size={18} />}
      >
        <p>You spent 12% less</p>
        <p>than last month</p>

        <div className="mini-chart">
          <span />
        </div>
      </FloatingCard>

      <FloatingCard
        className="security-card"
        title="Secure Payments"
        icon={<ShieldCheck size={22} />}
      >
        <p>All transactions</p>
        <p>are 100% secure</p>

        <LockKeyhole className="corner-icon" size={18} />
      </FloatingCard>

      <FloatingCard
        className="investment-card"
        title="Investments"
        icon={<TrendingUp size={22} />}
      >
        <p>Your portfolio growth</p>
        <strong>+18.6% <span>this month</span></strong>
      </FloatingCard>

      <FloatingCard
        className="balance-card"
        title="Total Balance"
      >
        <div className="balance-row">
          <strong>₹ 1,28,560</strong>
          <WalletCards size={28} />
        </div>

        <button>
          View details
          <ArrowUpRight size={16} />
        </button>
      </FloatingCard>

      <TrustBar
        items={[
          {
            icon: <ShieldCheck />,
            title: "Bank-level",
            subtitle: "Security",
          },
          {
            icon: <Zap />,
            title: "Fast & Easy",
            subtitle: "Transactions",
          },
          {
            icon: <Users />,
            title: "Trusted by",
            subtitle: "Millions",
          },
        ]}
      />
    </section>
  );
};

export default FinancialScene;
8. components/TrustBar.jsx
const TrustBar = ({ items }) => {
  return (
    <div className="trust-bar">
      {items.map((item, index) => (
        <div className="trust-item" key={index}>
          <div className="trust-icon">{item.icon}</div>

          <div>
            <p>{item.title}</p>
            <span>{item.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustBar;
9. components/LoginForm.jsx
import { useState } from "react";

import {
  ArrowRight,
  Headphones,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  Zap,
} from "lucide-react";

const LoginForm = () => {
  const [mobileNumber, setMobileNumber] = useState("");

  const handleMobileChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setMobileNumber(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mobileNumber.length !== 10) {
      return;
    }

    console.log("Checking mobile number:", mobileNumber);

    /*
      API FLOW:

      1. Send mobileNumber to backend.
      2. Backend checks if registered.
      3. Send OTP.
      4. Navigate to OTP page.
      5. After OTP:
         Existing user -> Dashboard
         New user -> PAN Name + Password page
    */
  };

  return (
    <div className="login-wrapper">
      <div className="login-content">
        <div className="login-heading">
          <h2>
            Welcome to <span>FipMoney</span>
          </h2>

          <p>
            Enter your mobile number to securely
            <br />
            continue to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mobile-input-wrapper">
            <div className="country-selector">
              <span className="india-flag">🇮🇳</span>

              <strong>+91</strong>

              <span className="country-arrow">⌄</span>
            </div>

            <div className="input-divider" />

            <input
              type="tel"
              inputMode="numeric"
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={handleMobileChange}
              aria-label="Mobile number"
            />
          </div>

          <button
            type="submit"
            className="continue-button"
            disabled={mobileNumber.length !== 10}
          >
            <span>Continue</span>

            <span className="button-arrow">
              <ArrowRight size={24} />
            </span>
          </button>
        </form>

        <div className="otp-message">
          <span />
          <p>We’ll send you a secure OTP</p>
          <span />
        </div>

        <div className="security-message">
          <LockKeyhole size={25} />

          <p>
            Your data is protected with
            <br />
            bank-grade security
          </p>

          <div className="security-badge">
            <ShieldCheck size={27} />
          </div>
        </div>
      </div>

      <div className="login-benefits">
        <div className="benefit">
          <UserRound />

          <div>
            <p>Quick</p>
            <span>Onboarding</span>
          </div>
        </div>

        <div className="benefit-divider" />

        <div className="benefit">
          <ShieldCheck />

          <div>
            <p>Safe &</p>
            <span>Reliable</span>
          </div>
        </div>

        <div className="benefit-divider" />

        <div className="benefit">
          <Headphones />

          <div>
            <p>24/7</p>
            <span>Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
10. styles/auth.css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

:root {
  --background: #f3f4f5;
  --white: #ffffff;

  --text-primary: #111827;
  --text-secondary: #687083;

  --gold: #d89221;
  --gold-light: #efb652;
  --gold-dark: #b87312;

  --border: rgba(17, 24, 39, 0.1);

  --shadow:
    0 30px 80px rgba(49, 45, 36, 0.08),
    0 10px 30px rgba(49, 45, 36, 0.05);
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  width: 100%;
  min-height: 100%;
  margin: 0;
}

body {
  font-family: "Inter", sans-serif;
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(226, 180, 103, 0.1),
      transparent 30%
    ),
    #f3f4f5;

  color: var(--text-primary);
}

button,
input {
  font: inherit;
}

button {
  border: none;
}

.auth-page {
  width: 100%;
  min-height: 100vh;
  padding: 4px;
}

.auth-shell {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 8px);
  overflow: hidden;

  background: #fff;

  border: 1px solid rgba(25, 32, 45, 0.1);
  border-radius: 42px;

  box-shadow: var(--shadow);
}

.auth-header {
  position: absolute;
  z-index: 20;

  top: 0;
  left: 0;

  width: 100%;

  padding: 48px 56px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  pointer-events: none;
}

.auth-header > * {
  pointer-events: auto;
}

/* BRAND */

.brand-logo {
  display: flex;
  align-items: center;
  gap: 20px;
}

.brand-symbol {
  display: flex;
  align-items: center;

  height: 68px;

  font-size: 52px;
  font-weight: 800;
  letter-spacing: -13px;

  background: linear-gradient(
    145deg,
    #efb74e,
    #b76c0e
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-symbol span:last-child {
  transform: translateX(-4px);
}

.brand-copy h1 {
  margin: 0;

  font-size: 35px;
  line-height: 1;

  letter-spacing: -1.8px;
}

.brand-copy p {
  margin: 9px 0 0;

  color: var(--gold-dark);

  font-size: 16px;
}

/* HEADER ACTIONS */

.header-actions {
  display: flex;
  align-items: center;
  gap: 25px;
}

.help-button,
.language-button {
  display: flex;
  align-items: center;

  background: transparent;
  color: var(--text-primary);

  cursor: pointer;
}

.help-button {
  gap: 13px;

  font-size: 16px;
}

.help-button svg {
  color: var(--gold);
}

.language-button {
  gap: 18px;

  padding: 13px 18px;

  border: 1px solid var(--border);
  border-radius: 25px;
}

/* MAIN CONTENT */

.auth-content {
  display: grid;

  grid-template-columns:
    minmax(0, 1.04fr)
    minmax(560px, 0.96fr);

  min-height: calc(100vh - 8px);
}

/* FINANCIAL SECTION */

.financial-section {
  position: relative;

  min-height: calc(100vh - 8px);

  overflow: hidden;

  background:
    linear-gradient(
      130deg,
      #ffffff 0%,
      #fffdf8 35%,
      #f8ead3 100%
    );
}

.financial-section::after {
  content: "";

  position: absolute;

  top: -15%;
  right: -170px;

  width: 300px;
  height: 130%;

  background: white;

  border-radius: 50%;

  z-index: 10;
}

.financial-background {
  position: absolute;
  inset: 0;

  background:
    radial-gradient(
      circle at 73% 42%,
      rgba(229, 172, 75, 0.24),
      transparent 28%
    ),
    linear-gradient(
      140deg,
      transparent 35%,
      rgba(224, 178, 100, 0.13)
    );
}

.financial-copy {
  position: absolute;

  z-index: 5;

  top: 180px;
  left: 52px;
}

.financial-copy h2 {
  margin: 0;

  font-size: clamp(40px, 3.5vw, 61px);
  line-height: 1.02;

  letter-spacing: -3px;
}

.financial-copy h2 span {
  color: #b77b28;
}

.financial-copy p {
  margin: 28px 0 0;

  font-size: 19px;
}

.financial-copy strong {
  display: block;

  margin-top: 16px;

  color: #c67f18;

  font-size: 20px;
  font-weight: 500;
}

/* SCENE */

.scene-center {
  position: absolute;

  top: 27%;
  left: 41%;

  width: 48%;
  height: 52%;

  z-index: 4;
}

.gateway {
  position: absolute;

  border: 3px solid rgba(215, 152, 45, 0.22);

  border-radius: 50% 50% 0 0;
}

.gateway-one {
  width: 320px;
  height: 450px;

  left: 20%;
  top: -5%;
}

.gateway-two {
  width: 260px;
  height: 390px;

  left: 28%;
  top: 4%;
}

/* PHONE */

.phone-device {
  position: absolute;

  z-index: 5;

  width: 128px;
  height: 280px;

  left: 34%;
  top: 13%;

  padding: 7px;

  background: #222;

  border: 3px solid #8e8e8e;
  border-radius: 27px;

  box-shadow:
    0 30px 50px rgba(93, 62, 12, 0.2);
}

.phone-screen {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: white;

  border-radius: 20px;
}

.phone-screen span {
  font-size: 13px;
}

.phone-logo {
  margin: 16px 0 10px;

  font-size: 42px;
  font-weight: 800;

  color: var(--gold);
}

/* CARD */

.credit-card {
  position: absolute;

  z-index: 7;

  width: 180px;
  height: 118px;

  top: 38%;
  left: -3%;

  padding: 18px;

  background:
    linear-gradient(
      135deg,
      #fff8e9,
      #e3a73d
    );

  border: 1px solid #d58d17;
  border-radius: 15px;

  transform: rotate(-12deg);

  box-shadow:
    0 20px 40px rgba(107, 69, 9, 0.18);
}

.card-logo {
  font-weight: 800;
  color: var(--gold-dark);
}

.card-chip {
  width: 29px;
  height: 21px;

  margin-top: 12px;

  border: 1px solid rgba(118, 70, 7, 0.5);
  border-radius: 5px;
}

.card-contactless {
  position: absolute;

  right: 17px;
  top: 16px;

  font-size: 12px;
}

.card-number {
  margin-top: 12px;

  font-size: 10px;
}

/* RUPEE */

.rupee-symbol {
  position: absolute;

  right: 2%;
  bottom: 2%;

  font-size: 120px;
  font-weight: 700;

  color: var(--gold);

  text-shadow:
    0 12px 20px rgba(137, 89, 12, 0.15);
}

/* COINS */

.coins {
  position: absolute;

  left: 13%;
  bottom: -2%;

  display: flex;
  align-items: flex-end;
}

.coins span {
  width: 42px;

  background:
    repeating-linear-gradient(
      to bottom,
      #e7ad42 0 5px,
      #c7831c 5px 7px
    );

  border-radius: 6px 6px 0 0;
}

.coins span:nth-child(1) {
  height: 45px;
}

.coins span:nth-child(2) {
  height: 80px;
}

.coins span:nth-child(3) {
  height: 120px;
}

.coins span:nth-child(4) {
  height: 150px;
}

/* FLOATING CARDS */

.floating-card {
  position: absolute;

  z-index: 8;

  padding: 20px;

  background: rgba(255, 255, 255, 0.93);

  border: 1px solid rgba(116, 87, 41, 0.08);
  border-radius: 17px;

  box-shadow:
    0 18px 40px rgba(81, 60, 27, 0.12);

  backdrop-filter: blur(20px);
}

.floating-card-header {
  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 13px;
  font-weight: 600;
}

.floating-icon {
  color: var(--gold);
}

.floating-card-content {
  margin-top: 14px;
}

.floating-card-content p {
  margin: 5px 0;

  font-size: 11px;
  line-height: 1.5;
}

.spending-card {
  top: 16%;
  right: 4%;

  width: 190px;
}

.security-card {
  left: 5%;
  top: 53%;

  width: 220px;
}

.investment-card {
  left: 6%;
  bottom: 18%;

  width: 230px;
}

.investment-card strong {
  color: var(--gold-dark);
}

.investment-card strong span {
  color: var(--text-primary);
  font-weight: 400;
}

.balance-card {
  right: 8%;
  bottom: 22%;

  width: 220px;
}

.balance-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.balance-row strong {
  font-size: 20px;
}

.balance-row svg {
  color: var(--gold);
}

.balance-card button {
  margin-top: 16px;

  display: flex;
  align-items: center;
  gap: 7px;

  background: transparent;
  color: var(--gold-dark);

  cursor: pointer;
}

/* TRUST BAR */

.trust-bar {
  position: absolute;

  z-index: 12;

  left: 3%;
  bottom: 3%;

  width: 76%;

  display: grid;
  grid-template-columns: repeat(3, 1fr);

  padding: 25px 30px;

  background: rgba(255, 255, 255, 0.92);

  border: 1px solid var(--border);
  border-radius: 17px;

  box-shadow:
    0 15px 30px rgba(53, 43, 25, 0.07);
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 15px;

  padding: 0 22px;

  border-right: 1px solid var(--border);
}

.trust-item:last-child {
  border-right: none;
}

.trust-icon {
  color: var(--gold);
}

.trust-item p,
.trust-item span {
  margin: 0;

  font-size: 13px;
  line-height: 1.5;
}

/* LOGIN */

.login-section {
  position: relative;

  z-index: 11;

  min-height: calc(100vh - 8px);

  background: white;
}

.login-wrapper {
  min-height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding:
    clamp(190px, 25vh, 270px)
    clamp(50px, 6vw, 100px)
    32px;
}

.login-content {
  width: 100%;
  max-width: 530px;

  margin: 0 auto;
}

.login-heading h2 {
  margin: 0;

  font-size: clamp(34px, 3vw, 47px);
  line-height: 1.1;

  letter-spacing: -2px;
}

.login-heading h2 span {
  color: var(--gold);
}

.login-heading p {
  margin: 25px 0 0;

  color: var(--text-secondary);

  font-size: 19px;
  line-height: 1.6;
}

.login-content form {
  margin-top: 45px;
}

.mobile-input-wrapper {
  width: 100%;
  height: 72px;

  display: flex;
  align-items: center;

  padding: 0 17px;

  border: 1px solid rgba(38, 46, 60, 0.17);
  border-radius: 13px;

  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.mobile-input-wrapper:focus-within {
  border-color: var(--gold);

  box-shadow:
    0 0 0 4px rgba(216, 146, 33, 0.1);
}

.country-selector {
  display: flex;
  align-items: center;
  gap: 12px;

  white-space: nowrap;
}

.india-flag {
  font-size: 26px;
}

.country-selector strong {
  font-size: 18px;
}

.input-divider {
  width: 1px;
  height: 33px;

  margin: 0 18px;

  background: var(--border);
}

.mobile-input-wrapper input {
  flex: 1;

  min-width: 0;

  border: none;
  outline: none;

  background: transparent;

  font-size: 17px;
  color: var(--text-primary);
}

.mobile-input-wrapper input::placeholder {
  color: #8e94a2;
}

.continue-button {
  position: relative;

  width: 100%;
  height: 70px;

  margin-top: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      135deg,
      #dfa237,
      #d48c1f
    );

  color: white;

  border-radius: 13px;

  font-size: 18px;
  font-weight: 600;

  cursor: pointer;

  transition:
    transform 0.2s,
    box-shadow 0.2s,
    opacity 0.2s;
}

.continue-button:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow:
    0 15px 30px rgba(203, 132, 27, 0.25);
}

.continue-button:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.button-arrow {
  position: absolute;

  right: 18px;

  width: 45px;
  height: 45px;

  display: grid;
  place-items: center;

  background: #fff0cf;
  color: #9e6613;

  border-radius: 50%;
}

/* OTP */

.otp-message {
  margin: 40px 0;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 17px;

  color: var(--text-secondary);
}

.otp-message span {
  width: 35px;
  height: 1px;

  background: #e1d5c3;
}

.otp-message p {
  margin: 0;

  font-size: 16px;
}

/* SECURITY */

.security-message {
  min-height: 93px;

  display: flex;
  align-items: center;

  padding: 20px 24px;

  border: 1px solid var(--border);
  border-radius: 14px;

  box-shadow:
    0 8px 25px rgba(49, 44, 35, 0.03);
}

.security-message > svg {
  margin-right: 20px;

  color: var(--gold);
}

.security-message p {
  flex: 1;

  margin: 0;

  color: #50596b;

  font-size: 15px;
  line-height: 1.5;
}

.security-badge {
  width: 53px;
  height: 53px;

  display: grid;
  place-items: center;

  color: var(--gold);

  border: 1px solid rgba(216, 146, 33, 0.4);
  border-radius: 50%;
}

/* BENEFITS */

.login-benefits {
  width: 100%;

  margin-top: 60px;

  display: grid;
  grid-template-columns:
    1fr auto 1fr auto 1fr;

  align-items: center;

  padding: 25px 35px;

  background: #fffdfa;

  border: 1px solid var(--border);
  border-radius: 17px;
}

.benefit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.benefit svg {
  color: var(--gold);
}

.benefit p,
.benefit span {
  display: block;

  margin: 0;

  font-size: 14px;
  line-height: 1.6;
}

.benefit-divider {
  width: 1px;
  height: 40px;

  background: var(--border);
}

/* RESPONSIVE */

@media (max-width: 1200px) {
  .auth-content {
    grid-template-columns: 1fr 1fr;
  }

  .financial-copy h2 {
    font-size: 45px;
  }

  .spending-card {
    right: 8%;
  }

  .investment-card {
    display: none;
  }

  .trust-bar {
    width: 90%;
  }
}

@media (max-width: 950px) {
  .auth-page {
    padding: 0;
  }

  .auth-shell {
    min-height: 100vh;

    border-radius: 0;
  }

  .auth-header {
    position: relative;

    padding: 25px;
  }

  .auth-content {
    display: block;
  }

  .financial-section {
    min-height: 340px;

    border-radius: 0 0 45px 45px;
  }

  .financial-section::after {
    display: none;
  }

  .financial-copy {
    top: 45px;
    left: 25px;
  }

  .financial-copy h2 {
    font-size: 39px;
  }

  .financial-copy p {
    font-size: 15px;
  }

  .scene-center {
    left: 57%;
    top: 10%;

    transform: scale(0.7);
  }

  .floating-card,
  .trust-bar {
    display: none;
  }

  .login-section {
    min-height: auto;
  }

  .login-wrapper {
    padding: 60px 25px 30px;
  }

  .login-benefits {
    margin-top: 50px;
  }
}

@media (max-width: 600px) {
  .auth-header {
    padding: 20px;
  }

  .brand-logo {
    gap: 10px;
  }

  .brand-symbol {
    font-size: 35px;
  }

  .brand-copy h1 {
    font-size: 24px;
  }

  .brand-copy p {
    font-size: 11px;
  }

  .help-button span {
    display: none;
  }

  .language-button {
    padding: 9px 13px;
  }

  .financial-section {
    min-height: 300px;
  }

  .financial-copy {
    top: 35px;
  }

  .financial-copy h2 {
    font-size: 34px;

    letter-spacing: -2px;
  }

  .financial-copy p {
    margin-top: 17px;
  }

  .financial-copy strong {
    margin-top: 9px;

    font-size: 16px;
  }

  .scene-center {
    left: 58%;
    top: 12%;

    transform: scale(0.55);
  }

  .login-wrapper {
    padding: 45px 20px 25px;
  }

  .login-heading h2 {
    font-size: 32px;
  }

  .login-heading p {
    font-size: 15px;
  }

  .mobile-input-wrapper {
    height: 64px;
  }

  .continue-button {
    height: 62px;
  }

  .otp-message {
    margin: 30px 0;
  }

  .otp-message p {
    font-size: 13px;
  }

  .security-message {
    padding: 17px;
  }

  .login-benefits {
    padding: 20px 10px;
  }

  .benefit {
    flex-direction: column;

    gap: 7px;

    text-align: center;
  }

  .benefit p,
  .benefit span {
    font-size: 11px;
  }
}