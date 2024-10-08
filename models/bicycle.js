const mongoose = require('mongoose');

const BicycleSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    required: true,
    default: 'available'
  },
  type: {
    type: String,  // For example: road, mountain, hybrid
    required: true
  },
  description: {
    type: String,
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bicycle', BicycleSchema);
