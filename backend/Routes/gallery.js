const express = require('express');
const {
  getGallery,
  getCategories,
  uploadImage,
  updateImage,
  deleteImage,
  getFeaturedImages,
  incrementViews
} = require('../Controllers/galleryController');
const { protect, authorize } = require('../Middleware/auth');
const upload = require('../Middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getGallery);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedImages);
router.put('/:id/view', incrementViews);

// Protected routes
router.use(protect);
router.use(authorize('admin', 'moderator'));

router.post('/', upload, uploadImage);
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);

module.exports = router;
