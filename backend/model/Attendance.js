const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  
  course: {
    type: String,
    required: true,
  },

  studentId: {
    type: String,
    required: true,
  },

  studentName: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;

