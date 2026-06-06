const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  toggleUserActive,
  getUserStats
} = require('../Controllers/userController');
const { protect, authorize } = require('../Middleware/auth');

const router = express.Router();

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/users/stats', getUserStats);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle-active', toggleUserActive);

module.exports = router;
