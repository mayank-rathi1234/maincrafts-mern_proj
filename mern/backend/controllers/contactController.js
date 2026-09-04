const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');
const { getPagination, buildPaginationMeta } = require('../utils/paginate');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @desc    Create a new contact form submission
 * @route   POST /api/contacts
 * @access  Public
 */
const createContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  // Mirror the original client-side validation with a server-side check,
  // since the client can never be trusted as the only line of defense.
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    res.status(400);
    throw new Error('Name, email, and message are all required.');
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    res.status(400);
    throw new Error('Please enter a valid email address.');
  }

  const contact = await Contact.create({
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    date: new Date(),
  });

  res.status(201).json({ success: true, data: contact });
});

/**
 * @desc    Get contact submissions, newest first, paginated
 * @route   GET /api/contacts?page=1&limit=10
 * @access  Public
 */
const getContacts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const [contacts, totalItems] = await Promise.all([
    Contact.find().sort({ date: -1 }).skip(skip).limit(limit),
    Contact.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts,
    pagination: buildPaginationMeta(page, limit, totalItems),
  });
});

/**
 * @desc    Get a single contact submission by id
 * @route   GET /api/contacts/:id
 * @access  Public
 */
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('Submission not found');
  }
  res.status(200).json({ success: true, data: contact });
});

/**
 * @desc    Delete a single contact submission
 * @route   DELETE /api/contacts/:id
 * @access  Public
 */
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('Submission not found');
  }
  await contact.deleteOne();
  res.status(200).json({ success: true, data: { id: req.params.id } });
});

/**
 * @desc    Delete ALL contact submissions
 * @route   DELETE /api/contacts
 * @access  Public
 */
const clearContacts = asyncHandler(async (req, res) => {
  const result = await Contact.deleteMany({});
  res.status(200).json({ success: true, deletedCount: result.deletedCount });
});

module.exports = {
  createContact,
  getContacts,
  getContact,
  deleteContact,
  clearContacts,
};
