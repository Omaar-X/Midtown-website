const express = require('express');
const {
  submitContact,
  getContacts,
  getContact,
  updateContactStatus,
  addResponse,
  getContactStats
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route
router.post('/', submitContact);

// Protected routes
router.use(protect);
router.use(authorize('admin', 'moderator'));

router.get('/', getContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContact);
router.put('/:id/status', updateContactStatus);
router.post('/:id/response', addResponse);

module.exports = router;