const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number']
  },
  plotSize: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  preferredTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'any']
  },
  message: String,
  status: {
    type: String,
    enum: ['pending', 'contacted', 'site-visited', 'converted', 'lost'],
    default: 'pending'
  },
  source: {
    type: String,
    enum: ['website', 'phone', 'whatsapp', 'email', 'social-media'],
    default: 'website'
  },
  followUpDate: Date,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    note: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  conversionValue: Number,
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
enquirySchema.index({ project: 1, status: 1 });
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ email: 1 });

module.exports = mongoose.model('Enquiry', enquirySchema);