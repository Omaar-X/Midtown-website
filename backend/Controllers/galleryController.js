const Gallery = require('../models/Gallery');
const cloudinary = require('../config/cloudinary');

// @desc    Get all gallery images
// @route   GET /api/v1/gallery
// @access  Public
exports.getGallery = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let query = Gallery.find(queryObj);

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-displayOrder -createdAt');
    }

    // Filter by category
    if (req.query.category) {
      query = query.where('category').equals(req.query.category);
    }

    // Filter by project
    if (req.query.project) {
      query = query.where('project').equals(req.query.project);
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    query = query.skip(startIndex).limit(limit);

    const gallery = await query.populate('project', 'title slug');

    res.status(200).json({
      success: true,
      count: gallery.length,
      data: gallery
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get gallery categories
// @route   GET /api/v1/gallery/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Gallery.distinct('category');
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload gallery image
// @route   POST /api/v1/gallery
// @access  Private/Admin
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image'
      });
    }

    const file = req.files.image;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'midtown/gallery',
      transformation: [
        { width: 1500, crop: 'scale' },
        { quality: 'auto:good' }
      ]
    });

    const galleryData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      project: req.body.project,
      tags: req.body.tags ? req.body.tags.split(',') : [],
      isFeatured: req.body.isFeatured === 'true',
      displayOrder: req.body.displayOrder || 0,
      uploadedBy: req.user.id,
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }
    };

    const gallery = await Gallery.create(galleryData);

    res.status(201).json({
      success: true,
      data: gallery
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update gallery image
// @route   PUT /api/v1/gallery/:id
// @access  Private/Admin
exports.updateImage = async (req, res, next) => {
  try {
    let gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: gallery
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/v1/gallery/:id
// @access  Private/Admin
exports.deleteImage = async (req, res, next) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(gallery.image.publicId);

    await gallery.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured gallery images
// @route   GET /api/v1/gallery/featured
// @access  Public
exports.getFeaturedImages = async (req, res, next) => {
  try {
    const images = await Gallery.find({ isFeatured: true })
      .sort('-displayOrder -createdAt')
      .limit(8)
      .populate('project', 'title slug');

    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment view count
// @route   PUT /api/v1/gallery/:id/view
// @access  Public
exports.incrementViews = async (req, res, next) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    gallery.views += 1;
    await gallery.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      views: gallery.views
    });
  } catch (error) {
    next(error);
  }
};