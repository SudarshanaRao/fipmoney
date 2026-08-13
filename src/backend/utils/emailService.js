import nodemailer from 'nodemailer';
import { SendMailClient } from 'zeptomail';
import EmailTemplate from '../models/EmailTemplate.js';
import EmailLog from '../models/EmailLog.js';

// Default HTML Email Templates Seed Data - Empty so templates can be created from scratch
const DEFAULT_TEMPLATES = [];

let isDefaultTemplatesSeeded = true;

// Helper to seed default HTML templates
export async function seedDefaultEmailTemplates() {
  try {
    const onboardingHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to Fipmoney — Your Account Is Ready</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: Arial, Helvetica, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; color: #1a1a1a;">
    <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; color: transparent; font-size: 1px; line-height: 1px; max-width: 0px;">
        Welcome to Fipmoney! Your account has been created successfully. Explore 24K Digital Gold, Digital Silver, and smart wealth tools.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f9; width: 100%; margin: 0; padding: 40px 15px;">
        <tr>
            <td align="center" valign="top">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #eaedf2; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.07); margin: 0 auto;">
                    <tr>
                        <td align="center" valign="middle" style="padding: 30px 40px 22px; background-color: #ffffff; border-bottom: 1px solid #f0f0f0;">
                            <a href="{{FIPMONEY_HOME_URL}}" target="_blank" style="text-decoration: none; display: inline-block;">
                                <img src="{{FIPMONEY_LOGO_URL}}" alt="Fipmoney Logo" width="155" style="display: block; width: 155px; max-width: 155px; height: auto; border: 0; outline: none; text-decoration: none;" />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="top" style="padding: 35px 40px 25px; background-color: #ffffff;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 18px;">
                                <tr>
                                    <td align="center" style="background-color: #fff8e7; border-radius: 30px; padding: 6px 16px; border: 1px solid #ffe8b3;">
                                        <span style="font-family: Arial, sans-serif; font-size: 11px; font-weight: 800; color: #b27a00; letter-spacing: 1px; text-transform: uppercase; display: block;">
                                            Account Verified &amp; Ready
                                        </span>
                                    </td>
                                </tr>
                            </table>
                            <img src="{{HELLO_RAFIKI_ANIMATION_URL}}" alt="Welcome to Fipmoney" width="280" style="display: block; width: 100%; max-width: 280px; height: auto; margin: 0 auto 20px; border: 0; outline: none;" />
                            <h1 style="margin: 0 0 14px; font-family: Arial, sans-serif; font-size: 26px; line-height: 34px; font-weight: 800; color: #111111; text-align: center;">
                                Welcome aboard, {{userName}}! 🚀
                            </h1>
                            <p style="margin: 0 0 28px; font-family: Arial, sans-serif; font-size: 15px; line-height: 25px; color: #555555; text-align: center;">
                                Congratulations on creating your Fipmoney account! You now have direct access to India's premier platform for 24K Digital Gold micro-savings, Digital Silver, and automated wealth creation.
                            </p>
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                                <tr>
                                    <td align="center" style="background-color: #b8860b; border-radius: 12px; padding: 15px 36px;">
                                        <a href="{{FIPMONEY_DASHBOARD_URL}}" target="_blank" style="font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; color: #ffffff; text-decoration: none; display: inline-block; letter-spacing: 0.5px;">
                                            Open Your Fipmoney Dashboard &rarr;
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="top" style="padding: 10px 40px 30px; background-color: #ffffff;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa; border: 1px solid #eeeeee; border-radius: 16px; margin-bottom: 16px;">
                                <tr>
                                    <td width="100" valign="middle" style="padding: 18px 0 18px 18px;">
                                        <img src="{{DIGITAL_GOLD_ILLUSTRATION_URL}}" alt="Digital Gold" width="90" style="display: block; width: 90px; height: auto; border-radius: 10px; border: 0;" />
                                    </td>
                                    <td valign="middle" style="padding: 18px 20px 18px 15px; text-align: left;">
                                        <div style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 700; color: #171717; margin-bottom: 6px;">
                                            ✨ 24K 99.9% Pure Digital Gold
                                        </div>
                                        <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 20px; color: #666666;">
                                            Start micro-saving in 24K 999.9 pure gold insured in Brink's physical vaults starting from just ₹1.
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa; border: 1px solid #eeeeee; border-radius: 16px; margin-bottom: 16px;">
                                <tr>
                                    <td width="100" valign="middle" style="padding: 18px 0 18px 18px;">
                                        <img src="{{DIGITAL_SILVER_ILLUSTRATION_URL}}" alt="Digital Silver" width="90" style="display: block; width: 90px; height: auto; border-radius: 10px; border: 0;" />
                                    </td>
                                    <td valign="middle" style="padding: 18px 20px 18px 15px; text-align: left;">
                                        <div style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 700; color: #171717; margin-bottom: 6px;">
                                            🥈 99.9% Pure Digital Silver
                                        </div>
                                        <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 20px; color: #666666;">
                                            Accumulate silver digitally at live market rates with zero storage fee and instant liquidity.
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa; border: 1px solid #eeeeee; border-radius: 16px; margin-bottom: 16px;">
                                <tr>
                                    <td width="100" valign="middle" style="padding: 18px 0 18px 18px;">
                                        <img src="{{WALLET_BRO_ANIMATION_URL}}" alt="Smart Wallet" width="90" style="display: block; width: 90px; height: auto; border-radius: 10px; border: 0;" />
                                    </td>
                                    <td valign="middle" style="padding: 18px 20px 18px 15px; text-align: left;">
                                        <div style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 700; color: #171717; margin-bottom: 6px;">
                                            💳 Instant Digital Wallet &amp; Micro-SIP
                                        </div>
                                        <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 20px; color: #666666;">
                                            Automate daily, weekly, or monthly micro-SIPs seamlessly from your encrypted Fipmoney virtual card.
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafafa; border: 1px solid #eeeeee; border-radius: 16px; margin-bottom: 16px;">
                                <tr>
                                    <td width="100" valign="middle" style="padding: 18px 0 18px 18px;">
                                        <img src="{{GROWTH_ANALYTICS_AMICO_ANIMATION_URL}}" alt="Analytics" width="90" style="display: block; width: 90px; height: auto; border-radius: 10px; border: 0;" />
                                    </td>
                                    <td valign="middle" style="padding: 18px 20px 18px 15px; text-align: left;">
                                        <div style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 700; color: #171717; margin-bottom: 6px;">
                                            📈 Real-Time Portfolio Analytics
                                        </div>
                                        <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 20px; color: #666666;">
                                            Monitor live market price benchmarks, historical gold yields, and independent Vistra trustee holdings 24/7.
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fffcf4; border: 2px dashed #d4a62a; border-radius: 16px; margin-top: 15px;">
                                <tr>
                                    <td align="center" style="padding: 24px;">
                                        <div style="font-family: Arial, sans-serif; font-size: 17px; font-weight: 800; color: #7a5800; margin-bottom: 8px;">
                                            💼 Become a Digital Gold Agent (DGA)
                                        </div>
                                        <p style="margin: 0 0 16px; font-family: Arial, sans-serif; font-size: 13px; line-height: 21px; color: #6b551e;">
                                            Want to earn up to <strong>2.5% lifetime commissions</strong>? Join our DGA network to build your financial advisory business with Fipmoney.
                                        </p>
                                        <a href="{{DGA_URL}}" target="_blank" style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 700; color: #ffffff; background-color: #171717; padding: 11px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
                                            Become a DGA Now
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <div style="margin-top: 30px; font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 22px; text-align: left;">
                                If you have any questions or need guidance getting started, simply reply to this email or contact our support team.
                                <br/><br/>
                                Warm regards,<br/>
                                <strong style="color: #171717;">Team Fipmoney</strong>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="top" style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #eeeeee;">
                            <div style="margin-bottom: 18px;">
                                <a href="{{FIPMONEY_HOME_URL}}" target="_blank" style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; text-decoration: none; margin: 0 8px; font-weight: 500;">Home</a>
                                <a href="{{FIPMONEY_ABOUT_URL}}" target="_blank" style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; text-decoration: none; margin: 0 8px; font-weight: 500;">About Us</a>
                                <a href="{{FIPMONEY_CONTACT_URL}}" target="_blank" style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; text-decoration: none; margin: 0 8px; font-weight: 500;">Contact Us</a>
                                <a href="{{FIPMONEY_FAQ_URL}}" target="_blank" style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; text-decoration: none; margin: 0 8px; font-weight: 500;">FAQs</a>
                                <a href="{{FIPMONEY_TERMS_URL}}" target="_blank" style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; text-decoration: none; margin: 0 8px; font-weight: 500;">Terms &amp; Conditions</a>
                                <a href="{{FIPMONEY_PRIVACY_URL}}" target="_blank" style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; text-decoration: none; margin: 0 8px; font-weight: 500;">Privacy Policy</a>
                            </div>
                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 11px; line-height: 18px; color: #999999;">
                                &copy; {{currentYear}} Fipmoney Technologies. All rights reserved.
                            </p>
                            <p style="margin-top: 12px; font-family: Arial, sans-serif; font-size: 12px; color: #777777;">
                                Need assistance? 
                                <a href="mailto:{{supportEmail}}" style="color: #b8860b; text-decoration: none; font-weight: 600;">{{supportEmail}}</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    await EmailTemplate.findOneAndUpdate(
      { templateId: 'FIPMONEY_WELCOME_ONBOARDING' },
      {
        templateId: 'FIPMONEY_WELCOME_ONBOARDING',
        name: 'Fipmoney Welcome & Onboarding',
        subject: 'Welcome to Fipmoney — Your Account Is Ready',
        category: 'Onboarding',
        htmlContent: onboardingHtml,
        variables: [
          'userName', 'currentYear', 'supportEmail', 'FIPMONEY_LOGO_URL', 'HELLO_RAFIKI_ANIMATION_URL',
          'WALLET_BRO_ANIMATION_URL', 'EWALLET_PANA_ANIMATION_URL', 'DIGITAL_GOLD_ILLUSTRATION_URL',
          'DIGITAL_SILVER_ILLUSTRATION_URL', 'MANAGE_MONEY_AMICO_ANIMATION_URL',
          'GROWTH_ANALYTICS_AMICO_ANIMATION_URL', 'DGA_URL', 'FIPMONEY_DASHBOARD_URL',
          'FIPMONEY_HOME_URL', 'FIPMONEY_ABOUT_URL', 'FIPMONEY_CONTACT_URL',
          'FIPMONEY_FAQ_URL', 'FIPMONEY_TERMS_URL', 'FIPMONEY_PRIVACY_URL'
        ]
      },
      { upsert: true, new: true }
    );

    await EmailTemplate.findOneAndUpdate(
      { templateId: 'WELCOME_SIGNUP' },
      {
        templateId: 'WELCOME_SIGNUP',
        name: 'Fipmoney Welcome & Onboarding',
        subject: 'Welcome to Fipmoney — Your Account Is Ready',
        category: 'Onboarding',
        htmlContent: onboardingHtml,
        variables: [
          'userName', 'currentYear', 'supportEmail', 'FIPMONEY_LOGO_URL', 'HELLO_RAFIKI_ANIMATION_URL',
          'WALLET_BRO_ANIMATION_URL', 'EWALLET_PANA_ANIMATION_URL', 'DIGITAL_GOLD_ILLUSTRATION_URL',
          'DIGITAL_SILVER_ILLUSTRATION_URL', 'MANAGE_MONEY_AMICO_ANIMATION_URL',
          'GROWTH_ANALYTICS_AMICO_ANIMATION_URL', 'DGA_URL', 'FIPMONEY_DASHBOARD_URL',
          'FIPMONEY_HOME_URL', 'FIPMONEY_ABOUT_URL', 'FIPMONEY_CONTACT_URL',
          'FIPMONEY_FAQ_URL', 'FIPMONEY_TERMS_URL', 'FIPMONEY_PRIVACY_URL'
        ]
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error('[seedDefaultEmailTemplates Error]', err);
  }
}

// Render HTML template with dynamic variables
export function renderHtmlTemplate(html, variables = {}) {
  let baseDomain = (variables.baseUrl || variables.origin || process.env.APP_BASE_URL || 'https://www.fipmoney.com').trim();
  if (baseDomain.endsWith('/')) {
    baseDomain = baseDomain.slice(0, -1);
  }

  const defaultVars = {
    currentYear: new Date().getFullYear(),
    supportEmail: 'support@fipmoney.com',
    baseUrl: baseDomain,
    FIPMONEY_LOGO_URL: `${baseDomain}/fipmoney_logo_final.png`,
    HELLO_RAFIKI_ANIMATION_URL: `${baseDomain}/fipmoney-welcome-hello-rafiki.gif`,
    WALLET_BRO_ANIMATION_URL: `${baseDomain}/fipmoney-wallet-bro.gif`,
    EWALLET_PANA_ANIMATION_URL: `${baseDomain}/fipmoney-ewallet-pana.gif`,
    DIGITAL_GOLD_ILLUSTRATION_URL: `${baseDomain}/hero_banner_digital_gold.png`,
    DIGITAL_SILVER_ILLUSTRATION_URL: `${baseDomain}/hero_banner_digital_silver.png`,
    MANAGE_MONEY_AMICO_ANIMATION_URL: `${baseDomain}/fipmoney-manage-money-amico.gif`,
    GROWTH_ANALYTICS_AMICO_ANIMATION_URL: `${baseDomain}/fipmoney-growth-analytics-amico.gif`,
    DGA_URL: `${baseDomain}/become-agent`,
    FIPMONEY_DASHBOARD_URL: `${baseDomain}/dashboard`,
    FIPMONEY_HOME_URL: `${baseDomain}/`,
    FIPMONEY_ABOUT_URL: `${baseDomain}/about`,
    FIPMONEY_CONTACT_URL: `${baseDomain}/contact`,
    FIPMONEY_FAQ_URL: `${baseDomain}/faq`,
    FIPMONEY_TERMS_URL: `${baseDomain}/terms-and-conditions`,
    FIPMONEY_PRIVACY_URL: `${baseDomain}/privacy-policy`,
  };
  const mergedVars = { ...defaultVars, ...variables };
  let rendered = html;
  Object.keys(mergedVars).forEach((key) => {
    const value = mergedVars[key] !== undefined ? mergedVars[key] : '';
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
export async function sendCustomEmail(toEmail, subject, body, fromEmail, category = '', variables = {}) {
  const sender = getSenderAddressByCategory(category, fromEmail);
  const zeptoClient = getZeptoClient();

  const renderedSubject = renderHtmlTemplate(subject, variables);
  const renderedHtml = renderHtmlTemplate(body, variables);

  if (zeptoClient) {
    try {
      const recipientName = variables.userName || variables.name || 'Valued User';
      const response = await zeptoClient.sendMail({
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
      console.log(`[Zoho ZeptoMail] Custom email sent to ${toEmail}`);
      return { success: true, message: `Email sent to ${toEmail} via Zoho ZeptoMail`, response };
    } catch (err) {
      console.error('[Zoho ZeptoMail Error]:', err.message || err);
      return { success: false, message: err.message || 'ZeptoMail send failed' };
    }
  } else {
    console.log(`[EmailService Mock] Custom Email sent to ${toEmail} | Subject: "${renderedSubject}"`);
    return { success: true, message: `Mock email sent to ${toEmail}` };
  }
}
