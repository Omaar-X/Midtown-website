const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide project title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  location: {
    type: String,
    required: [true, 'Please provide project location']
  },
  description: {
    type: String,
    required: [true, 'Please provide project description']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  features: [{
    type: String,
    required: true
  }],
  plotSizes: [{
    size: String,
    available: Boolean,
    price: Number,
    totalPlots: Number,
    soldPlots: Number
  }],
  images: [{
    url: String,
    altText: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'sold-out'],
    default: 'upcoming'
  },
  category: {
    type: String,
    enum: ['residential', 'commercial', 'mixed'],
    default: 'residential'
  },
  mapLocation: {
    lat: Number,
    lng: Number
  },
  amenities: [String],
  totalPlots: {
    type: Number,
    required: true
  },
  availablePlots: {
    type: Number,
    required: true
  },
  priceRange: {
    min: Number,
    max: Number,
    unit: {
      type: String,
      default: 'BDT'
    }
  },
  roadWidth: {
    type: String,
    required: true
  },
  handoverDate: Date,
  launchDate: {
    type: Date,
    default: Date.now
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  views: {
    type: Number,
    default: 0
  },
  enquiryCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title before saving
projectSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  next();
});

// Virtual for sold plots
projectSchema.virtual('soldPlots').get(function() {
  return this.totalPlots - this.availablePlots;
});

// Virtual for progress percentage
projectSchema.virtual('progress').get(function() {
  return ((this.totalPlots - this.availablePlots) / this.totalPlots) * 100;
});

// Indexes for better query performance
projectSchema.index({ status: 1, isFeatured: 1 });
projectSchema.index({ location: 1 });
projectSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model('Project', projectSchema);