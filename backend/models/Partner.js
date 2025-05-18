
const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  currentLoad: {
    type: Number,
    default: 0
  },
  areas: [{
    type: String
  }],
  shift: {
    start: String, // HH:mm
    end: String // HH:mm
  },
  metrics: {
    rating: {
      type: Number,
      default: 5.0
    },
    completedOrders: {
      type: Number,
      default: 0
    },
    cancelledOrders: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Partner', PartnerSchema);
