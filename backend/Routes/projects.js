const express = require('express');
const {
  getProjects,
  getProject,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImages,
  getFeaturedProjects,
  getProjectStats,
  submitEnquiry
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:id', getProject);
router.get('/slug/:slug', getProjectBySlug);
router.post('/:id/enquire', submitEnquiry);

// Protected routes
router.use(protect);
router.use(authorize('admin', 'moderator'));

router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/images', upload, uploadProjectImages);
router.get('/stats/projects', getProjectStats);

module.exports = router;