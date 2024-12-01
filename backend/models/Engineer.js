const mongoose = require('mongoose');

const EngineerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Ensure one engineer profile per user
  },
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  sobreMi: {
    type: String,
    required: true,
  },
  ingeniero: {
    type: String,
    required: true,
  },
  estudios: [
    {
      institution: { type: String, required: true },
      degree: { type: String, required: true },
    },
  ],
  servicios: [
    {
      service: { type: String, required: true },
      cost: { type: Number, required: true },
    },
  ],
  imageUrl: {
    type: String,
    default: '',
  },
  published: {
    type: Boolean,
    default: true,
  },
  starCount: {
    type: Number,
    default: 0,
  },
  totalAppointments: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      reviewer: { type: String },
      rating: { type: Number },
      comment: { type: String },
    },
  ],
  requests: [
    {
      requester: { type: String, required: true },
      message: { type: String, required: true },
      service: { type: String, required: true }, // Added service field
    },
  ],
  workHours: {
    type: Map,
    of: Array, // Map of days with arrays of available hours
  },
});

module.exports = mongoose.model('Engineer', EngineerSchema);
