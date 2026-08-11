import EmailTemplate from '../models/EmailTemplate.js';
import { seedDefaultEmailTemplates } from '../utils/emailService.js';

/**
 * @desc    Create a new Email Template in database
 * @route   POST /api/email-templates
 */
export const createEmailTemplate = async (req, res, next) => {
  try {
    const { name, subject, body, htmlContent, category, templateId, template_id, variables } = req.body;

    if (!name || !subject || (!body && !htmlContent)) {
      res.status(400);
      throw new Error('Name, subject, and body/htmlContent are required');
    }

    const cleanId = (templateId || template_id || `TMPL_${Date.now()}`).trim();
    const content = htmlContent || body || '';

    let existing = await EmailTemplate.findOne({
      $or: [{ templateId: cleanId }, { template_id: cleanId }, { name: name.trim() }]
    });

    if (existing) {
      existing.name = name.trim();
      existing.subject = subject.trim();
      existing.htmlContent = content;
      existing.body = content;
      if (category) existing.category = category;
      if (variables) existing.variables = variables;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: 'Email template updated successfully in database',
        data: existing,
      });
    }

    const template = await EmailTemplate.create({
      templateId: cleanId,
      template_id: cleanId,
      name: name.trim(),
      subject: subject.trim(),
      htmlContent: content,
      body: content,
      category: category || 'CUSTOM',
      variables: variables || ['userName', 'email'],
      createdBy: 'ADMIN',
    });

    return res.status(201).json({
      success: true,
      message: 'Email template created and stored in database successfully',
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all stored Email Templates from database
 * @route   GET /api/email-templates
 */
export const getAllEmailTemplates = async (req, res, next) => {
  try {
    await seedDefaultEmailTemplates();
    const { category, isActive } = req.query;
    const query = {};

    if (category) query.category = category;
    if (typeof isActive !== 'undefined') query.isActive = isActive === 'true';

    const templates = await EmailTemplate.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Email Template by ID from database
 * @route   GET /api/email-templates/:id
 */
export const getEmailTemplateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cleanId = String(id).trim();

    let template = null;
    if (cleanId.match(/^[0-9a-fA-F]{24}$/)) {
      template = await EmailTemplate.findById(cleanId);
    }
    if (!template) {
      template = await EmailTemplate.findOne({
        $or: [{ templateId: cleanId }, { template_id: cleanId }]
      });
    }

    if (!template) {
      res.status(404);
      throw new Error(`Email template '${cleanId}' not found in database`);
    }

    return res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Email Template in database
 * @route   PUT /api/email-templates/:id
 */
export const updateEmailTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cleanId = String(id).trim();
    const updates = { ...req.body };

    if (updates.body && !updates.htmlContent) {
      updates.htmlContent = updates.body;
    }
    if (updates.htmlContent && !updates.body) {
      updates.body = updates.htmlContent;
    }

    let template = null;
    if (cleanId.match(/^[0-9a-fA-F]{24}$/)) {
      template = await EmailTemplate.findByIdAndUpdate(cleanId, updates, { new: true, runValidators: true });
    }
    if (!template) {
      template = await EmailTemplate.findOneAndUpdate(
        { $or: [{ templateId: cleanId }, { template_id: cleanId }] },
        updates,
        { new: true, runValidators: true }
      );
    }

    if (!template) {
      res.status(404);
      throw new Error(`Email template '${cleanId}' not found in database`);
    }

    return res.status(200).json({
      success: true,
      message: 'Email template updated successfully in database',
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete Email Template from database
 * @route   DELETE /api/email-templates/:id
 */
export const deleteEmailTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cleanId = String(id).trim();

    let template = null;
    if (cleanId.match(/^[0-9a-fA-F]{24}$/)) {
      template = await EmailTemplate.findByIdAndDelete(cleanId);
    }
    if (!template) {
      template = await EmailTemplate.findOneAndDelete({
        $or: [
          { templateId: cleanId },
          { template_id: cleanId },
          { templateId: cleanId.toUpperCase() },
          { template_id: cleanId.toUpperCase() }
        ]
      });
    }

    if (!template) {
      res.status(404);
      throw new Error(`Email template '${cleanId}' not found in database`);
    }

    return res.status(200).json({
      success: true,
      message: 'Email template deleted successfully from database',
    });
  } catch (error) {
    next(error);
  }
};
