const Attendance = require('../model/Attendance');
const { Student } = require('../model/Student')

// http://localhost:5000/ADMIN/getAttendance     

const getAttendance = async (req, res) => {
  const { course } = req.params;

  try {
    const attendances = await Attendance.find({ course: course });

    if (!attendances || attendances.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for the specified course name' });
    }

    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving attendance records', error });
  }
};

// http://localhost:5000/ADMIN/addAttendance     
const addAttendance = async (req, res) => {
  try {
    const newAttendance = new Attendance(req.body);
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Error adding attendance record', error });
  }
};

// http://localhost:5000/ADMIN/updateAttendance     
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAttendance = await Attendance.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Error updating attendance record', error });
  }
};

// http://localhost:5000/ADMIN/deleteAttendance
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    await Attendance.findByIdAndDelete(id);
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting attendance record', error });
  }
};

// http://localhost:5000/ADMIN/getStudentsByCourseAndBatch:
const getStudentsByCourseAndBatch = async (req, res) => {
  const selectedCourse = req.params.Course;
  const selectedBatch = req.params.Batch;

  try {
    const students = await Student.aggregate([
      {
        $match: {
          Course: selectedCourse
        }
      },
      {
        $unwind: {
          path: "$Course",
          includeArrayIndex: "courseIndex"
        }
      },
      {
        $unwind: {
          path: "$Batch",
          includeArrayIndex: "batchIndex"
        }
      },
      {
        $match: {
          Course: selectedCourse,
          Batch: selectedBatch,
          $expr: {
            $eq: ["$batchIndex", "$courseIndex"]
          }
        }
      },
      {
        $project: {
          _id: 1,
          Course: 1,
          Batch: 1,
          fullName: {
            $concat: ['$Fname', ' ', '$Lname']
          }
        }
      }
    ]);

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No students found for the specified course and batch' });
    }

    const response = {
      Course: selectedCourse,
      Batch: selectedBatch,

      students: students.map(student => ({
        _id: student._id,
        Course: student.Course,
        Batch: student.Batch,
        fullName: student.fullName
      }))
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students', error });
  }
};

module.exports = {
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
  getStudentsByCourseAndBatch
}
