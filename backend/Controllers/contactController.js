const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/v1/contacts
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);

    // Send confirmation email to user
    const userMessage = `
      <h2>Thank You for Contacting MIDTOWN AABASHON LTD</h2>
      <p>Dear ${req.body.name},</p>
      <p>We have received your message and our team will get back to you within 24 hours.</p>
      <p><strong>Your Message:</strong> ${req.body.message}</p>
      <hr>
      <p>Best regards,<br>MIDTOWN AABASHON LTD Team</p>
    `;

    await sendEmail({
      email: req.body.email,
      subject: 'Thank You for Contacting Us',
      message: userMessage
    });

    // Send notification to admin
    const adminMessage = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${req.body.name}</p>
      <p><strong>Email:</strong> ${req.body.email}</p>
      <p><strong>Phone:</strong> ${req.body.phone}</p>
      <p><strong>Subject:</strong> ${req.body.subject}</p>
      <p><strong>Message:</strong> ${req.body.message}</p>
    `;

    await sendEmail({
      email: process.env.ADMIN_EMAIL,
      subject: `New Contact: ${req.body.subject}`,
      message: adminMessage
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contacts
// @route   GET /api/v1/contacts
// @access  Private/Admin
exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find()
      .sort('-createdAt')
      .populate('project', 'title')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact
// @route   GET /api/v1/contacts/:id
// @access  Private/Admin
exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('project', 'title')
      .populate('assignedTo', 'name email')
      .populate('notes.createdBy', 'name');

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    // Mark as read
    if (!contact.isRead) {
      contact.isRead = true;
      await contact.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status
// @route   PUT /api/v1/contacts/:id/status
// @access  Private/Admin
exports.updateContactStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    contact.status = req.body.status;
    contact.assignedTo = req.body.assignedTo || contact.assignedTo;
    contact.priority = req.body.priority || contact.priority;
    contact.followUpDate = req.body.followUpDate || contact.followUpDate;

    if (req.body.note) {
      contact.notes.push({
        note: req.body.note,
        createdBy: req.user.id
      });
    }

    await contact.save();

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add response to contact
// @route   POST /api/v1/contacts/:id/response
// @access  Private/Admin
exports.addResponse = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    contact.response = {
      message: req.body.message,
      respondedBy: req.user.id,
      respondedAt: Date.now()
    };

    contact.status = 'resolved';
    await contact.save();

    // Send response email to user
    const message = `
      <h2>Response to Your Query</h2>
      <p>Dear ${contact.name},</p>
      <p>Thank you for contacting MIDTOWN AABASHON LTD.</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #0e4e82; margin: 20px 0;">
        ${req.body.message}
      </div>
      <p>If you have any further questions, please don't hesitate to contact us.</p>
      <hr>
      <p>Best regards,<br>MIDTOWN AABASHON LTD Team</p>
    `;

    await sendEmail({
      email: contact.email,
      subject: 'Response to Your Query',
      message
    });

    res.status(200).json({
      success: true,
      message: 'Response sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact statistics
// @route   GET /api/v1/contacts/stats
// @access  Private/Admin
exports.getContactStats = async (req, res, next) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$count' },
          stats: { $push: { status: '$_id', count: '$count' } }
        }
      },
      {
        $unwind: '$stats'
      },
      {
        $project: {
          _id: 0,
          status: '$stats.status',
          count: '$stats.count',
          percentage: {
            $multiply: [
              { $divide: ['$stats.count', '$total'] },
              100
            ]
          }
        }
      }
    ]);

    const total = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new', isRead: false });

    res.status(200).json({
      success: true,
      data: {
        stats,
        total,
        newContacts
      }
    });
  } catch (error) {
    next(error);
  }
};