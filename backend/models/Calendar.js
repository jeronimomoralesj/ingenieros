const mongoose = require('mongoose');

const CalendarSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  hour: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  engineerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Engineer',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Engineer',
    required: true,
  },
});

module.exports = mongoose.model('Calendar', CalendarSchema);
