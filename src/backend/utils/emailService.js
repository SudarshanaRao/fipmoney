import nodemailer from 'nodemailer';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
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
  }
];

// Helper to seed default HTML templates if missing
export async function seedDefaultEmailTemplates() {
  try {
    for (const tmpl of DEFAULT_TEMPLATES) {
      const existing = await EmailTemplate.findOne({ templateId: tmpl.templateId });
      if (!existing) {
        await EmailTemplate.create(tmpl);
        console.log(`[EmailService] Seeded HTML template: ${tmpl.templateId}`);
      }
    }
  } catch (err) {
    console.error('[EmailService] Error seeding email templates:', err.message);
  }
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

// Initialize AWS SES v2 Client
function getSesV2Client() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || 'ap-south-1';

  if (accessKeyId && secretAccessKey) {
    return new SESv2Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return null;
}

// Create Nodemailer Transporter Fallback
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  return null; // Fallback mock
}

// Send Templated HTML Email via AWS SES v2 API (or Nodemailer SMTP)
export async function sendTemplatedEmail({ toEmail, templateId, fromEmail, variables = {} }) {
  const logId = 'EML' + Math.floor(100000 + Math.random() * 900000);
  const senderAddress = fromEmail || process.env.SMTP_FROM || 'support@fipmoney.com';
  
  try {
    const template = await EmailTemplate.findOne({ templateId: String(templateId).toUpperCase() });
    if (!template) {
      throw new Error(`Email Template '${templateId}' not found in database.`);
    }

    const renderedSubject = renderHtmlTemplate(template.subject, variables);
    const renderedHtml = renderHtmlTemplate(template.htmlContent, variables);

    const sesClient = getSesV2Client();
    const transporter = getTransporter();
    let status = 'MOCK_DELIVERED';
    let errorMessage = '';

    // Primary: Try AWS SES v2 API
    if (sesClient) {
      try {
        const command = new SendEmailCommand({
          FromEmailAddress: senderAddress.includes('<') ? senderAddress : `"FipMoney Support" <${senderAddress}>`,
          Destination: {
            ToAddresses: [toEmail],
          },
          Content: {
            Simple: {
              Subject: {
                Data: renderedSubject,
                Charset: 'UTF-8',
              },
              Body: {
                Html: {
                  Data: renderedHtml,
                  Charset: 'UTF-8',
                },
              },
            },
          },
        });

        const sesResponse = await sesClient.send(command);
        status = 'SENT';
        console.log(`[AWS SES v2] Email sent to ${toEmail} | MessageId: ${sesResponse.MessageId}`);
      } catch (sesErr) {
        console.warn(`[AWS SES v2] SES Send warning: ${sesErr.message}. Falling back to Nodemailer SMTP.`);
        if (transporter) {
          try {
            await transporter.sendMail({
              from: senderAddress.includes('<') ? senderAddress : `"FipMoney Support" <${senderAddress}>`,
              to: toEmail,
              subject: renderedSubject,
              html: renderedHtml,
            });
            status = 'SENT';
          } catch (smtpErr) {
            status = 'FAILED';
            errorMessage = smtpErr.message;
            console.error('[EmailService] SMTP send error:', smtpErr);
          }
        } else {
          status = 'FAILED';
          errorMessage = sesErr.message;
        }
      }
    } else if (transporter) {
      try {
        await transporter.sendMail({
          from: senderAddress.includes('<') ? senderAddress : `"FipMoney Support" <${senderAddress}>`,
          to: toEmail,
          subject: renderedSubject,
          html: renderedHtml,
        });
        status = 'SENT';
      } catch (err) {
        status = 'FAILED';
        errorMessage = err.message;
        console.error('[EmailService] SMTP send error:', err);
      }
    } else {
      console.log(`[EmailService Mock] Simulated email sent from ${senderAddress} to ${toEmail} | Subject: "${renderedSubject}" | Template: ${templateId}`);
    }

    const log = await EmailLog.create({
      logId,
      toEmail,
      templateId,
      subject: renderedSubject,
      variables: { ...variables, fromEmail: senderAddress },
      status,
      error: errorMessage,
      sentAt: new Date(),
    });

    return {
      success: status !== 'FAILED',
      logId,
      status,
      senderAddress,
      renderedSubject,
      message: status === 'SENT' ? `Email sent successfully via AWS SES to ${toEmail}` : 'Email logged and delivered in mock mode',
      log,
    };
  } catch (err) {
    console.error('[EmailService] Failed to send email:', err.message);
    await EmailLog.create({
      logId,
      toEmail: toEmail || 'unknown@domain.com',
      templateId: templateId || 'UNKNOWN',
      subject: 'Failed Delivery',
      variables: { ...variables, fromEmail: senderAddress },
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

// Bulk Email Sending Helper via AWS SES v2 API
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
    message: `Processed ${recipients.length} emails via AWS SES (${sentCount} sent/processed, ${failedCount} failed).`,
  };
}
