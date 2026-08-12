import nodemailer from 'nodemailer';
import { SendMailClient } from 'zeptomail';
import EmailTemplate from '../models/EmailTemplate.js';
import EmailLog from '../models/EmailLog.js';

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
