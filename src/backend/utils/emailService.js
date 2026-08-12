import nodemailer from 'nodemailer';
import { SendMailClient } from 'zeptomail';
import EmailTemplate from '../models/EmailTemplate.js';
import EmailLog from '../models/EmailLog.js';

// Default HTML Email Templates Seed Data
const DEFAULT_TEMPLATES = [
  {
    templateId: 'WELCOME_SIGNUP',
    name: 'Welcome & Signup Onboarding Email',
    subject: 'Welcome to FipMoney - Your 24K 99.9% Pure Gold Locker is Ready!',
    category: 'Onboarding',
    variables: ['userName', 'mobileNumber', 'referralCode'],
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8FAFC; color: #1E293B; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #E2E8F0; }
    .header { background: linear-gradient(135deg, #161730 0%, #2A1A4E 100%); padding: 30px; text-align: center; color: #FFFFFF; }
    .logo-text { font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #F59E0B; }
    .content { padding: 30px; }
    .gold-box { background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 15px; margin: 20px 0; text-align: center; }
    .btn { display: inline-block; background: #7C3AED; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: bold; margin-top: 20px; }
    .footer { background: #F1F5F9; padding: 20px; text-align: center; font-size: 12px; color: #64748B; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">FIPMONEY</div>
      <h2 style="margin: 10px 0 0 0; color: #FFFFFF;">Welcome to FipMoney! 🚀</h2>
    </div>
    <div class="content">
      <h3>Hi {{userName}},</h3>
      <p>Congratulations! Your FipMoney account is officially created for <strong>{{mobileNumber}}</strong>. You can now start saving in 24K 99.9% pure digital gold starting from just ₹10.</p>
      
      <div class="gold-box">
        <h4 style="margin: 0; color: #D97706;">✨ Your Unique Referral Code: <strong>{{referralCode}}</strong></h4>
        <p style="margin: 5px 0 0 0; font-size: 13px; color: #78350F;">Share your referral link with friends and get ₹50 free gold when they start saving!</p>
      </div>

      <p>Key Benefits of FipMoney:</p>
      <ul>
        <li>🔒 Certified 24K 99.9% pure gold stored in Swiss Brink's Vaults.</li>
        <li>🛡️ 100% Trustee Security guaranteed by Vistra Security Trustee.</li>
        <li>⚡ Instant 24x7 buy, sell, or physical coin delivery to your doorstep.</li>
      </ul>

      <div style="text-align: center;">
        <a href="https://fipmoney.com/dashboard" class="btn">Open Your Gold Locker</a>
      </div>
    </div>
    <div class="footer">
      © 2026 FipMoney Digital Gold Holdings Ltd. All rights reserved.<br>
      Brink's Vault Custody • Vistra Trustee Insured
    </div>
  </div>
</body>
</html>`
  },
  {
    templateId: 'KYC_VERIFIED',
    name: 'KYC Verification Approval Notice',
    subject: 'Verification Complete - Your FipMoney Account is Now Fully Verified!',
    category: 'Security',
    variables: ['userName', 'mobileNumber', 'amlScore'],
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', sans-serif; background-color: #F8FAFC; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; overflow: hidden; }
    .header { background: #064E3B; padding: 30px; text-align: center; color: #FFFFFF; }
    .badge { background: #10B981; color: #FFFFFF; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 12px; }
    .content { padding: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>KYC Verification Approved ✅</h2>
    </div>
    <div class="content">
      <h3>Hello {{userName}},</h3>
      <p>Great news! Your KYC document verification has been successfully approved for <strong>{{mobileNumber}}</strong>.</p>
      <p>Your AML Audit Score has been boosted to <span class="badge">{{amlScore}} / 100 (Low Risk)</span>.</p>
      <p>You can now make unlimited transactions and request instant physical gold coin delivery or bank cash sell payouts anytime.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    templateId: 'GOLD_PURCHASE_RECEIPT',
    name: 'Gold Purchase Invoice & Receipt',
    subject: 'Transaction Confirmed - 24K Gold Added to Your Vault',
    category: 'Transactions',
    variables: ['userName', 'txId', 'amount', 'grams', 'ratePerGram'],
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', sans-serif; background-color: #F8FAFC; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; overflow: hidden; }
    .header { background: #D97706; padding: 25px; text-align: center; color: #FFFFFF; }
    .receipt-table { w-full; margin-top: 15px; border-collapse: collapse; width: 100%; }
    .receipt-table td { padding: 10px; border-bottom: 1px solid #E2E8F0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin:0;">Gold Vault Purchase Receipt 🪙</h2>
    </div>
    <div class="content" style="padding: 25px;">
      <p>Dear {{userName}},</p>
      <p>Your purchase of 24K 99.9% Pure Gold was successful. Details below:</p>
      <table class="receipt-table">
        <tr><td><strong>Transaction ID:</strong></td><td>{{txId}}</td></tr>
        <tr><td><strong>Gold Added:</strong></td><td style="color:#D97706; font-weight:bold;">{{grams}} g</td></tr>
        <tr><td><strong>Total Amount Paid:</strong></td><td>₹{{amount}}</td></tr>
        <tr><td><strong>Gold Rate (per gram):</strong></td><td>₹{{ratePerGram}}</td></tr>
        <tr><td><strong>Custody Vault:</strong></td><td>Brink's Vault (Insured)</td></tr>
      </table>
    </div>
  </div>
</body>
</html>`
  },
  {
    templateId: 'FIPMONEY_OTP_VERIFICATION',
    name: 'Fipmoney OTP Verification',
    subject: 'Your Fipmoney Verification Code',
    category: 'Security',
    variables: ['userName', 'verificationCode', 'expiryMinutes', 'currentYear', 'supportEmail', 'mobileNumber', 'referralCode', 'otp'],
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <title>Your Fipmoney Verification Code</title>

    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f6f7f9;
            font-family: Arial, Helvetica, sans-serif;
            color: #171717;
        }

        table {
            border-spacing: 0;
            border-collapse: collapse;
        }

        img {
            border: 0;
            display: block;
            max-width: 100%;
        }

        a {
            text-decoration: none;
        }

        .email-wrapper {
            width: 100%;
            background-color: #f6f7f9;
            padding: 40px 15px;
        }

        .email-container {
            width: 100%;
            max-width: 620px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 8px 35px rgba(0, 0, 0, 0.06);
        }

        .header {
            padding: 30px 35px 22px;
            text-align: center;
            background-color: #ffffff;
        }

        .logo {
            width: 145px;
            margin: 0 auto;
        }

        .content {
            padding: 20px 45px 42px;
        }

        .badge {
            display: inline-block;
            padding: 7px 13px;
            border-radius: 30px;
            background-color: #fff8e7;
            color: #b27a00;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .title {
            margin: 18px 0 12px;
            font-size: 28px;
            line-height: 36px;
            font-weight: 700;
            color: #171717;
        }

        .description {
            margin: 0;
            font-size: 15px;
            line-height: 25px;
            color: #686868;
        }

        .otp-wrapper {
            margin: 30px 0;
            padding: 25px;
            background-color: #fafafa;
            border: 1px solid #eeeeee;
            border-radius: 14px;
            text-align: center;
        }

        .otp-label {
            margin-bottom: 10px;
            font-size: 12px;
            font-weight: 600;
            color: #888888;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .otp {
            font-size: 34px;
            line-height: 42px;
            font-weight: 700;
            letter-spacing: 9px;
            color: #b8860b;
            padding-left: 9px;
        }

        .expiry {
            margin-top: 12px;
            font-size: 13px;
            color: #777777;
        }

        .security-box {
            margin-top: 25px;
            padding: 16px 18px;
            background-color: #fffaf0;
            border-left: 4px solid #d4a62a;
            border-radius: 8px;
        }

        .security-title {
            margin: 0 0 6px;
            font-size: 13px;
            font-weight: 700;
            color: #574000;
        }

        .security-text {
            margin: 0;
            font-size: 12px;
            line-height: 20px;
            color: #75684d;
        }

        .closing {
            margin-top: 28px;
            font-size: 14px;
            line-height: 23px;
            color: #686868;
        }

        .footer {
            padding: 28px 30px;
            background-color: #fafafa;
            border-top: 1px solid #eeeeee;
            text-align: center;
        }

        .footer-links {
            margin-bottom: 17px;
        }

        .footer-links a {
            color: #777777;
            font-size: 12px;
            margin: 0 7px;
        }

        .footer-links a:hover {
            color: #b8860b;
        }

        .copyright {
            margin: 0;
            font-size: 11px;
            line-height: 18px;
            color: #999999;
        }

        .company {
            margin-top: 7px;
            font-size: 11px;
            color: #999999;
        }

        .support {
            margin-top: 14px;
            font-size: 12px;
            color: #777777;
        }

        .support a {
            color: #b8860b;
            font-weight: 600;
        }

        @media only screen and (max-width: 600px) {
            .email-wrapper {
                padding: 20px 10px;
            }

            .content {
                padding: 20px 25px 35px;
            }

            .header {
                padding: 25px 25px 18px;
            }

            .title {
                font-size: 24px;
                line-height: 32px;
            }

            .otp {
                font-size: 29px;
                letter-spacing: 7px;
            }

            .footer-links a {
                display: inline-block;
                margin: 4px 5px;
            }
        }
    </style>
</head>

<body>

    <!-- Preheader -->
    <div style="
        display:none;
        max-height:0;
        overflow:hidden;
        opacity:0;
        color:transparent;
        font-size:1px;
        line-height:1px;
    ">
        Your Fipmoney verification code is valid for {{expiryMinutes}} minutes.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" class="email-wrapper">

                <table
                    role="presentation"
                    class="email-container"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                >

                    <!-- HEADER -->
                    <tr>
                        <td class="header">

                            <img
                                src="https://i.ibb.co/R433pZhh/fipmoney-logo-final.png"
                                alt="Fipmoney"
                                width="145"
                                class="logo"
                            >

                        </td>
                    </tr>

                    <!-- CONTENT -->
                    <tr>
                        <td class="content">

                            <div class="badge">
                                Account Verification
                            </div>

                            <h1 class="title">
                                Verify your Fipmoney account
                            </h1>

                            <p class="description">
                                Hi {{userName}},
                                <br><br>
                                We received a request to verify your account.
                                Please use the verification code below to continue securely.
                            </p>

                            <!-- OTP -->
                            <div class="otp-wrapper">

                                <div class="otp-label">
                                    Your verification code
                                </div>

                                <div class="otp">
                                    {{verificationCode}}
                                </div>

                                <div class="expiry">
                                    This code is valid for
                                    <strong>{{expiryMinutes}} minutes</strong>.
                                </div>

                            </div>

                            <!-- SECURITY NOTICE -->
                            <div class="security-box">

                                <p class="security-title">
                                    🔒 Keep your code secure
                                </p>

                                <p class="security-text">
                                    Never share this verification code with anyone,
                                    including someone claiming to be from Fipmoney.
                                    Our team will never ask you for your OTP or password.
                                </p>

                            </div>

                            <p class="closing">
                                If you didn't request this verification code, you can
                                safely ignore this email. Your account remains protected.
                            </p>

                            <p class="closing">
                                Regards,<br>
                                <strong>Team Fipmoney</strong>
                            </p>

                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td class="footer">

                            <div class="footer-links">

                                <a href="https://www.fipmoney.com/">
                                    Home
                                </a>

                                <a href="https://www.fipmoney.com/about">
                                    About Us
                                </a>

                                <a href="https://www.fipmoney.com/contact">
                                    Contact Us
                                </a>

                                <a href="https://www.fipmoney.com/faq">
                                    FAQs
                                </a>

                                <a href="https://www.fipmoney.com/terms-and-conditions">
                                    Terms &amp; Conditions
                                </a>

                                <a href="https://www.fipmoney.com/privacy-policy">
                                    Privacy Policy
                                </a>

                            </div>

                            <p class="copyright">
                                © {{currentYear}} Fipmoney. All rights reserved.
                            </p>

                            <p class="company">
                                Fipmoney
                            </p>

                            <p class="support">
                                Need help?
                                <a href="mailto:{{supportEmail}}">
                                    Contact Fipmoney Support
                                </a>
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>`
  }
// Default HTML Email Templates Seed Data - Empty so templates can be created from scratch
const DEFAULT_TEMPLATES = [];

let isDefaultTemplatesSeeded = true;

// Helper to seed default HTML templates
export async function seedDefaultEmailTemplates() {
  return;
}

// Render HTML template with dynamic variables
export function renderHtmlTemplate(html, variables = {}) {
  let rendered = html;
  Object.keys(variables).forEach((key) => {
    const value = variables[key] !== undefined ? variables[key] : '';
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    rendered = rendered.replace(regex, value);
  });
  return rendered;
}

// Initialize Zoho ZeptoMail Client
function getZeptoClient() {
  const url = process.env.ZEPTOMAIL_URL || 'https://api.zeptomail.in/v1.1/email';
  const token = process.env.ZEPTOMAIL_TOKEN || 'Zoho-enczapikey PHtE6r1cRrjqjW8r8BgGt6XrE5OhPNsr/e8zf1JA5NpGWfYCS00HqN8slz++rRkoVKVEFKGanYpu47iV5umEJDm7MWxJXGqyqK3sx/VYSPOZsbq6x00euF8ZfkHVUI/sd9Bo0STVud+X';

  if (token) {
    return new SendMailClient({ url, token });
  }
  return null;
}

// Helper to format sender address for Zoho ZeptoMail
function formatSender(fromEmail) {
  let address = process.env.ZEPTOMAIL_FROM_ADDRESS || 'support@fipmoney.com';
  let name = process.env.ZEPTOMAIL_FROM_NAME || 'FipMoney';

  if (fromEmail) {
    if (fromEmail.includes('<') && fromEmail.includes('>')) {
      const match = fromEmail.match(/"?([^"<]+)"?\s*<([^>]+)>/);
      if (match) {
        name = match[1].trim();
        address = match[2].trim();
      } else {
        address = fromEmail.trim();
      }
    } else {
      address = fromEmail.trim();
    }
  }

  return { address, name };
}

/**
 * Resolves the appropriate Zoho ZeptoMail sender address based on email category:
 * 1. Authentication, Onboarding, Security, Compliance -> support@fipmoney.com
 * 2. Payments, Bill Payments, Digital Gold, Banking, Statements -> payments@fipmoney.com
 * 3. Promotional, Marketing -> info@fipmoney.com
 * 4. Queries & Support / Help -> no-reply@fipmoney.com
 */
export function getSenderAddressByCategory(category = '', explicitFromEmail = null) {
  if (explicitFromEmail && typeof explicitFromEmail === 'string' && explicitFromEmail.trim().length > 0 && explicitFromEmail.includes('@')) {
    return formatSender(explicitFromEmail);
  }

  const catLower = (category || '').toLowerCase().trim();

  // 1. Transactional / Authentication / Onboarding / Security / Compliance -> support@fipmoney.com
  if (
    catLower.includes('auth') ||
    catLower.includes('otp') ||
    catLower.includes('onboard') ||
    catLower.includes('security') ||
    catLower.includes('compliance') ||
    catLower.includes('kyc') ||
    catLower.includes('transactional')
  ) {
    return { address: 'support@fipmoney.com', name: 'FipMoney Support' };
  }

  // 2. Payments, Bill Payments, Digital Gold, Banking, Statements, Receipts, Transactions -> payments@fipmoney.com
  if (
    catLower.includes('payment') ||
    catLower.includes('bill') ||
    catLower.includes('gold') ||
    catLower.includes('silver') ||
    catLower.includes('bank') ||
    catLower.includes('invoice') ||
    catLower.includes('receipt') ||
    catLower.includes('statement') ||
    catLower.includes('billing') ||
    catLower.includes('transaction')
  ) {
    return { address: 'payments@fipmoney.com', name: 'FipMoney Payments' };
  }

  // 3. Promotional, Marketing -> info@fipmoney.com
  if (
    catLower.includes('promo') ||
    catLower.includes('marketing') ||
    catLower.includes('campaign') ||
    catLower.includes('offer')
  ) {
    return { address: 'info@fipmoney.com', name: 'FipMoney Info' };
  }

  // 4. Queries, Support, Help -> no-reply@fipmoney.com
  if (
    catLower.includes('query') ||
    catLower.includes('queries') ||
    catLower.includes('help') ||
    catLower.includes('desk') ||
    catLower.includes('no-reply') ||
    catLower.includes('noreply')
  ) {
    return { address: 'no-reply@fipmoney.com', name: 'FipMoney Support' };
  }

  // Default fallback -> support@fipmoney.com
  return { address: 'support@fipmoney.com', name: 'FipMoney Support' };
}

// Legacy Zoho Mail SMTP Transporter - Locked for now
function getTransporter() {
  // Zoho SMTP mail sending is locked in favor of Zoho ZeptoMail
  return null;
}

// Send Templated HTML Email via Zoho ZeptoMail API
export async function sendTemplatedEmail({ toEmail, templateId, fromEmail, variables = {} }) {
  const logId = 'EML' + Math.floor(100000 + Math.random() * 900000);
  
  try {
    const template = await EmailTemplate.findOne({ templateId: String(templateId).toUpperCase() });
    if (!template) {
      throw new Error(`Email Template '${templateId}' not found in database.`);
    }

    // Resolve sender address based on category rules
    const sender = getSenderAddressByCategory(template.category, fromEmail);

    const renderedSubject = renderHtmlTemplate(template.subject, variables);
    const renderedHtml = renderHtmlTemplate(template.htmlContent, variables);

    const zeptoClient = getZeptoClient();
    let status = 'MOCK_DELIVERED';
    let errorMessage = '';

    if (zeptoClient) {
      try {
        const recipientName = variables.userName || variables.name || 'Valued User';
        await zeptoClient.sendMail({
          from: sender,
          to: [
            {
              email_address: {
                address: toEmail,
                name: recipientName,
              },
            },
          ],
          subject: renderedSubject,
          htmlbody: renderedHtml,
        });

        status = 'SENT';
        console.log(`[Zoho ZeptoMail] Email sent successfully to ${toEmail} | Template: ${templateId}`);
      } catch (zeptoErr) {
        status = 'FAILED';
        errorMessage = zeptoErr.message || JSON.stringify(zeptoErr);
        console.error(`[Zoho ZeptoMail Error] Failed to send email to ${toEmail}:`, errorMessage);
      }
    } else {
      console.log(`[EmailService Mock] Simulated email sent from ${sender.address} to ${toEmail} | Subject: "${renderedSubject}" | Template: ${templateId}`);
    }

    const log = await EmailLog.create({
      logId,
      toEmail,
      templateId,
      subject: renderedSubject,
      variables: { ...variables, fromEmail: sender.address },
      status,
      error: errorMessage,
      sentAt: new Date(),
    });

    return {
      success: status !== 'FAILED',
      logId,
      status,
      senderAddress: sender.address,
      renderedSubject,
      message: status === 'SENT' ? `Email sent successfully via Zoho ZeptoMail to ${toEmail}` : 'Email logged and delivered in mock mode',
      log,
    };
  } catch (err) {
    console.error('[EmailService] Failed to send email:', err.message);
    await EmailLog.create({
      logId,
      toEmail: toEmail || 'unknown@domain.com',
      templateId: templateId || 'UNKNOWN',
      subject: 'Failed Delivery',
      variables: { ...variables, fromEmail: sender.address },
      status: 'FAILED',
      error: err.message,
      sentAt: new Date(),
    });

    return {
      success: false,
      logId,
      status: 'FAILED',
      error: err.message,
    };
  }
}

// Bulk Email Sending Helper via Zoho ZeptoMail API
export async function sendBulkEmail({ recipients = [], templateId, fromEmail, customVariables = {} }) {
  const results = [];
  let sentCount = 0;
  let failedCount = 0;

  for (const recipient of recipients) {
    const toEmail = typeof recipient === 'string' ? recipient : recipient.toEmail;
    const userName = (typeof recipient === 'object' && recipient.userName) ? recipient.userName : 'Valued User';
    const mobileNumber = (typeof recipient === 'object' && recipient.mobileNumber) ? recipient.mobileNumber : '';

    const res = await sendTemplatedEmail({
      toEmail,
      templateId,
      fromEmail,
      variables: {
        userName,
        mobileNumber,
        referralCode: (typeof recipient === 'object' && recipient.referralCode) ? recipient.referralCode : 'FIP2026',
        ...customVariables,
      },
    });

    results.push(res);
    if (res.success) sentCount++;
    else failedCount++;
  }

  return {
    success: failedCount === 0,
    total: recipients.length,
    sentCount,
    failedCount,
    results,
    message: `Processed ${recipients.length} emails (${sentCount} sent/processed, ${failedCount} failed).`,
  };
}

// Send Custom HTML Email directly via Zoho ZeptoMail Client
export async function sendCustomEmail(toEmail, subject, body, fromEmail, category = '') {
  const sender = getSenderAddressByCategory(category, fromEmail);
  const zeptoClient = getZeptoClient();

  if (zeptoClient) {
    try {
      const response = await zeptoClient.sendMail({
        from: sender,
        to: [
          {
            email_address: {
              address: toEmail,
              name: 'Valued User',
            },
          },
        ],
        subject: subject,
        htmlbody: body,
      });
      console.log(`[Zoho ZeptoMail] Custom email sent to ${toEmail}`);
      return { success: true, message: `Email sent to ${toEmail} via Zoho ZeptoMail`, response };
    } catch (err) {
      console.error('[Zoho ZeptoMail Error]:', err.message || err);
      return { success: false, message: err.message || 'ZeptoMail send failed' };
    }
  } else {
    console.log(`[EmailService Mock] Custom Email sent to ${toEmail} | Subject: "${subject}"`);
    return { success: true, message: `Mock email sent to ${toEmail}` };
  }
}
