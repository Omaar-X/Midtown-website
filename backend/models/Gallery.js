const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide image title'],
    trim: true
  },
  description: String,
  image: {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    width: Number,
    height: Number,
    format: String,
    bytes: Number
  },
  category: {
    type: String,
    enum: [
      'site-view',
      'progress',
      'handover',
      'events',
      'infrastructure',
      'aerial',
      'team',
      'office'
    ],
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  metadata: {
    camera: String,
    location: String,
    dateTaken: Date,
    photographer: String
  }
}, {
  timestamps: true
});

// Indexes
gallerySchema.index({ category: 1, createdAt: -1 });
gallerySchema.index({ project: 1 });
gallerySchema.index({ tags: 1 });
gallerySchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);