const Project = require('../models/Project');
const Enquiry = require('../models/Enquiry');

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Project.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Project.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const projects = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      pagination,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Public
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Increment views
    project.views += 1;
    await project.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by slug
// @route   GET /api/v1/projects/slug/:slug
// @access  Public
exports.getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Increment views
    project.views += 1;
    await project.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/v1/projects
// @access  Private/Admin
exports.createProject = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;
    req.body.lastUpdatedBy = req.user.id;

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Update lastUpdatedBy
    req.body.lastUpdatedBy = req.user.id;

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload project images
// @route   POST /api/v1/projects/:id/images
// @access  Private/Admin
exports.uploadProjectImages = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    if (!req.files || !req.files.images) {
      return res.status(400).json({
        success: false,
        error: 'Please upload images'
      });
    }

    const images = Array.isArray(req.files.images) 
      ? req.files.images 
      : [req.files.images];

    // Upload images to cloudinary
    const uploadPromises = images.map(async (image) => {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: 'midtown/projects',
        width: 1500,
        crop: 'scale'
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        altText: req.body.altText || image.name
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Add images to project
    project.images.push(...uploadedImages);
    await project.save();

    res.status(200).json({
      success: true,
      data: project.images
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured projects
// @route   GET /api/v1/projects/featured
// @access  Public
exports.getFeaturedProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ isFeatured: true })
      .sort('-createdAt')
      .limit(6);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project statistics
// @route   GET /api/v1/projects/stats
// @access  Private/Admin
exports.getProjectStats = async (req, res, next) => {
  try {
    const stats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalPlots: { $sum: '$totalPlots' },
          availablePlots: { $sum: '$availablePlots' }
        }
      },
      {
        $addFields: {
          soldPlots: { $subtract: ['$totalPlots', '$availablePlots'] }
        }
      }
    ]);

    const totalProjects = await Project.countDocuments();
    const totalEnquiries = await Enquiry.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        stats,
        totalProjects,
        totalEnquiries
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit project enquiry
// @route   POST /api/v1/projects/:id/enquire
// @access  Public
exports.submitEnquiry = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Create enquiry
    const enquiry = await Enquiry.create({
      project: req.params.id,
      ...req.body
    });

    // Increment enquiry count
    project.enquiryCount += 1;
    await project.save({ validateBeforeSave: false });

    // Send email notification
    const message = `
      <h2>New Project Enquiry</h2>
      <p><strong>Project:</strong> ${project.title}</p>
      <p><strong>Name:</strong> ${req.body.name}</p>
      <p><strong>Email:</strong> ${req.body.email}</p>
      <p><strong>Phone:</strong> ${req.body.phone}</p>
      <p><strong>Plot Size:</strong> ${req.body.plotSize}</p>
      <p><strong>Budget:</strong> ${req.body.budget}</p>
      <p><strong>Message:</strong> ${req.body.message || 'No message provided'}</p>
    `;

    await sendEmail({
      email: process.env.ADMIN_EMAIL,
      subject: `New Enquiry - ${project.title}`,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};