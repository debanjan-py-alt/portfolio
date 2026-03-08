const express = require('express');
const router  = express.Router();
const { submitContact, getContacts } = require('../controllers/contactController');
const { contactValidationRules }     = require('../middleware/validate');

// POST /api/contact  — Submit a new contact form message
router.post('/', contactValidationRules, submitContact);

// GET  /api/contact  — List all contact submissions
router.get('/', getContacts);

module.exports = router;
