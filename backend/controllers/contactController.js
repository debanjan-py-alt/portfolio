const { validationResult } = require('express-validator');
const Contact = require('../models/Contact');

// ─── POST /api/contact ─────────────────────────────────────────────────────
// @desc  Submit a new contact form message
// @access Public
const submitContact = async (req, res, next) => {
  try {
    // 1. Check express-validator results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed. Please check your input.',
        errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
      });
    }

    const { name, email, subject, message } = req.body;

    // 2. Save to database
    const contact = await Contact.create({
      name,
      email,
      subject: subject || 'No subject',
      message,
      ipAddress: req.ip,
    });

    // 3. Respond (don't expose the full document — just confirmation)
    res.status(201).json({
      success: true,
      message: "Message sent! I'll be in touch soon. 🚀",
      data: {
        id: contact._id,
        name: contact.name,
        createdAt: contact.createdAt,
      },
    });
  } catch (err) {
    next(err); // Forward to global error handler
  }
};

// ─── GET /api/contact ──────────────────────────────────────────────────────
// @desc  Get all contact submissions (for admin review)
// @access Public (you can add auth middleware later)
const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 }) // Newest first
      .select('-__v');          // Hide Mongoose version key

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitContact, getContacts };
