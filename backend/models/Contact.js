const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number']
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    enum: [
      'plot-enquiry',
      'site-visit',
      'investment',
      'general',
      'complaint',
      'suggestion',
      'other'
    ]
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  message: {
    type: String,
    required: [true, 'Please provide your message']
  },
  budget: {
    type: String,
    enum: ['1-10', '10-20', '20-30', '30-50', '50+', 'not-specified']
  },
  preferredLocation: String,
  plotSize: {
    type: String,
    enum: ['3-katha', '5-katha', '7-katha', '10-katha', 'custom']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'resolved', 'spam'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
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
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'social-media', 'referral'],
    default: 'website'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  response: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  }
}, {
  timestamps: true
});

// Indexes
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ phone: 1 });

module.exports = mongoose.model('Contact', contactSchema);