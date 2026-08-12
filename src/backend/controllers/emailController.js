import EmailTemplate from '../models/EmailTemplate.js';
import EmailLog from '../models/EmailLog.js';
import User from '../models/User.js';
import { sendTemplatedEmail, sendBulkEmail, sendCustomEmail, seedDefaultEmailTemplates } from '../utils/emailService.js';

// @desc    Get all stored HTML email templates
// @route   GET /api/emails/templates
export const getEmailTemplates = async (req, res, next) => {
  try {
    await seedDefaultEmailTemplates(); // Ensure defaults exist
    const templates = await EmailTemplate.find({}).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific HTML email template by templateId
// @route   GET /api/emails/templates/:templateId
export const getEmailTemplateById = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    const template = await EmailTemplate.findOne({ templateId: String(templateId).toUpperCase() });

    if (!template) {
      res.status(404);
      throw new Error(`Email template '${templateId}' not found`);
    }

    return res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update HTML email template (From Admin Panel)
// @route   POST /api/emails/templates
export const saveEmailTemplate = async (req, res, next) => {
  try {
    const { templateId, name, subject, htmlContent, category, variables, isActive } = req.body;

    if (!templateId || !name || !subject || !htmlContent) {
      res.status(400);
      throw new Error('templateId, name, subject, and htmlContent are required');
    }

    const cleanId = String(templateId).trim().toUpperCase();

    let template = await EmailTemplate.findOne({ templateId: cleanId });

    if (template) {
      // Update existing template
      template.name = name;
      template.subject = subject;
      template.htmlContent = htmlContent;
      if (category) template.category = category;
      if (variables) template.variables = variables;
      if (isActive !== undefined) template.isActive = isActive;
      await template.save();
    } else {
      // Create new template
      template = await EmailTemplate.create({
        templateId: cleanId,
        name,
        subject,
        htmlContent,
        category: category || 'Onboarding',
        variables: variables || ['userName', 'mobileNumber'],
        isActive: isActive !== undefined ? isActive : true,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Email template '${cleanId}' saved successfully`,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete HTML email template
// @route   DELETE /api/emails/templates/:templateId
export const deleteEmailTemplate = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    const cleanId = String(templateId).trim();

    let result = null;
    if (cleanId.match(/^[0-9a-fA-F]{24}$/)) {
      result = await EmailTemplate.findByIdAndDelete(cleanId);
    }
    if (!result) {
      result = await EmailTemplate.findOneAndDelete({
        $or: [
          { templateId: cleanId },
          { template_id: cleanId },
          { templateId: cleanId.toUpperCase() },
          { template_id: cleanId.toUpperCase() }
        ]
      });
    }

    if (!result) {
      res.status(404);
      throw new Error(`Email template '${cleanId}' not found in database`);
    }

    return res.status(200).json({
      success: true,
      message: `Email template '${cleanId}' deleted successfully from database`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Wipe all HTML email templates from database
// @route   DELETE /api/emails/templates-wipe/all
export const deleteAllEmailTemplates = async (req, res, next) => {
  try {
    await EmailTemplate.deleteMany({});
    return res.status(200).json({
      success: true,
      message: 'All email templates have been permanently wiped from the database.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send Templated Email to User
// @route   POST /api/emails/send
export const sendEmailToUser = async (req, res, next) => {
  try {
    const { toEmail, templateId, fromEmail, variables } = req.body;

    if (!toEmail || !templateId) {
      res.status(400);
      throw new Error('toEmail and templateId are required');
    }

    const result = await sendTemplatedEmail({
      toEmail: String(toEmail).trim(),
      templateId: String(templateId).trim().toUpperCase(),
      fromEmail: fromEmail ? String(fromEmail).trim() : undefined,
      variables: variables || {},
    });

    if (!result.success && result.status === 'FAILED') {
      res.status(500);
      throw new Error(result.error || 'Failed to send email');
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Send Welcome Onboarding Email to User Upon Signup
// @route   POST /api/emails/send-welcome
export const sendWelcomeEmail = async (req, res, next) => {
  try {
    const { mobileNumber, email, userName } = req.body;

    if (!mobileNumber && !email) {
      res.status(400);
      throw new Error('mobileNumber or email is required');
    }

    let user = null;
    if (mobileNumber) {
      user = await User.findOne({ mobileNumber: String(mobileNumber).trim() });
    } else if (email) {
      user = await User.findOne({ email: String(email).trim() });
    }

    const targetEmail = (email || (user ? user.email : '')) || `${mobileNumber}@fipmoney.com`;
    const targetName = userName || (user ? (user.fullName || user.username) : 'Valued Member');
    const referralCode = user ? user.referralCode : 'FIP2026';

    const result = await sendTemplatedEmail({
      toEmail: targetEmail,
      templateId: 'WELCOME_SIGNUP',
      fromEmail: 'noreply@fipmoney.com',
      variables: {
        userName: targetName,
        mobileNumber: mobileNumber || (user ? user.mobileNumber : ''),
        referralCode: referralCode,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Send Templated Email in Bulk to Multiple Selected Users
// @route   POST /api/emails/send-bulk
export const sendBulkEmailToUsers = async (req, res, next) => {
  try {
    const { recipients, templateId, fromEmail, customVariables } = req.body;

    if (!Array.isArray(recipients) || recipients.length === 0 || !templateId) {
      res.status(400);
      throw new Error('recipients (array) and templateId are required');
    }

    const result = await sendBulkEmail({
      recipients,
      templateId: String(templateId).trim().toUpperCase(),
      fromEmail: fromEmail ? String(fromEmail).trim() : undefined,
      customVariables: customVariables || {},
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Email Delivery Logs for Admin Panel
// @route   GET /api/emails/logs
export const getEmailLogs = async (req, res, next) => {
  try {
    const logs = await EmailLog.find({}).sort({ sentAt: -1 }).limit(100);

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send Email (Subject & Body / Template) to Selected Users via Zoho SMTP
// @route   POST /api/emails/send-to-users
export const sendEmailToUsers = async (req, res, next) => {
  try {
    const { recipients, subject, body, templateId, fromEmail, category } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Recipients array is required and must not be empty',
      });
    }

    if (!subject || !body) {
      return res.status(400).json({
        success: false,
        message: 'Subject and body are required',
      });
    }

    // Resolve email addresses if user IDs or objects were passed
    let emails = [];
    if (typeof recipients[0] === 'string' && recipients[0].includes('@')) {
      emails = recipients;
    } else {
      // Find users by userId, _id, or userCode
      const userRecords = await User.find({
        $or: [
          { userId: { $in: recipients } },
          { _id: { $in: recipients } },
          { userCode: { $in: recipients } },
          { email: { $in: recipients } }
        ]
      });
      emails = userRecords.map(u => u.email).filter(Boolean);
      if (emails.length === 0) {
        // Fallback: use recipients directly if they contain string values
        emails = recipients.map(r => typeof r === 'string' ? r : (r.email || r.toEmail)).filter(Boolean);
      }
    }

    if (emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid email addresses found for selected recipients',
      });
    }

    const results = [];
    for (const email of emails) {
      const result = await sendCustomEmail(email, subject, body, fromEmail, category);
      results.push({
        email,
        success: result.success,
        message: result.message,
      });
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return res.status(200).json({
      success: true,
      message: `Emails processed: ${successCount} succeeded, ${failureCount} failed`,
      data: {
        totalSent: successCount,
        totalFailed: failureCount,
        results,
      },
    });
  } catch (error) {
    next(error);
  }
};
