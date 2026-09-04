const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  getContact,
  deleteContact,
  clearContacts,
} = require('../controllers/contactController');

router.route('/').get(getContacts).post(createContact).delete(clearContacts);

router.route('/:id').get(getContact).delete(deleteContact);

module.exports = router;
