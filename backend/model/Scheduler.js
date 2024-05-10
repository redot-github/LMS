const mongoose = require('mongoose');

const schema = mongoose.Schema;

const useschema = new schema({
  event_id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  Batch: {
    type: String,
    required: true
  },
  BatchTime: {
    type: String,
    required: true
  },
  StaffName: {
    type: String,
    required: true
  },
  Date: {
    type: String,
    required: true
  },
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Scheduler', useschema);
