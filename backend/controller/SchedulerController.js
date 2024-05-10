const Scheduler = require('../model/Scheduler')
const { Staff } = require('../model/Staff')

//Add Scheduler:
const addScheduler = async (req, res) => {
  try {
    const { title, Batch, BatchTime, StaffName, Date } = req.body;

    const [start, end] = BatchTime.match(/\d{1,2}:\d{2}/g);

    const formattedDate = Date.split('/').join('-');
    const startDateTime = `${formattedDate}, ${start}`;
    const endDateTime = `${formattedDate}, ${end}`;

    const latestEvent = await Scheduler.findOne().sort({ event_id: -1 });
    let event_id = 1;
    if (latestEvent) {
      event_id = parseInt(latestEvent.event_id) + 1;
    }

    const event = new Scheduler({
      event_id: event_id.toString(),
      title,
      Batch,
      BatchTime,
      StaffName,
      Date: formattedDate,
      start: startDateTime,
      end: endDateTime,
    });
    await event.save();

    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Get All Scheduler:
const getAllSchedulers = async (req, res) => {
  try {
    const event = await Scheduler.find();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Scheduler By ID:
const getSchedulerById = async (req, res) => {
  try {
    const event = await Scheduler.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Scheduler not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Scheduler:
const updateScheduler = async (req, res) => {
  try {
    const { title, Batch, BatchTime, StaffName, Date } = req.body;

    // Format BatchTime
    const [start, end] = BatchTime.match(/\d{1,2}:\d{2}/g);

    // Format Date
    const formattedDate = Date.split('/').join('-');

    // Construct start and end date-time strings
    const startDateTime = `${formattedDate}, ${start}`;
    const endDateTime = `${formattedDate}, ${end}`;

    // Update event with formatted fields
    const event = await Scheduler.findByIdAndUpdate(
      req.params.id,
      {
        title,
        Batch,
        BatchTime,
        StaffName,
        Date: formattedDate,
        start: startDateTime,
        end: endDateTime,
      },
      { new: true }
    );

    // Check if event exists
    if (!event) {
      return res.status(404).json({ message: 'Scheduler not found' });
    }

    // Send updated event as response
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Scheduler:
const deleteScheduler = async (req, res) => {
  try {
    const event = await Scheduler.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Scheduler not found' });
    }
    res.status(200).json({ message: 'Scheduler deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// http://localhost:5000/ADMIN/getStaffByCourse:
const getStaffsByCourseAndBatch = async (req, res) => {
  const selectedCourse = req.params.Course;
  const selectedBatch = req.params.Batch;
  const selectedBatchTime = req.params.BatchTime;

  try {
    const staffs = await Staff.aggregate([
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
        $unwind: {
          path: "$BatchTime",
          includeArrayIndex: "batchTimeIndex"
        }
      },
      {
        $match: {
          Course: selectedCourse,
          Batch: selectedBatch,
          BatchTime: selectedBatchTime,
          $expr: {
            $and: [
              { $eq: ["$batchIndex", "$courseIndex"] },
              { $eq: ["$batchIndex", "$batchTimeIndex"] }
            ]
          }
        }
      },
      {
        $project: {
          _id: 1,
          Course: 1,
          Batch: 1,
          BatchTime: 1,
          StaffName: {
            $concat: ['$Fname', ' ', '$Lname']
          }
        }
      }
    ]);

    if (!staffs || staffs.length === 0) {
      return res.status(404).json({ message: 'No staffs found for the specified course, batch, and BatchTime' });
    }

    const response = {
      Course: selectedCourse,
      Batch: selectedBatch,
      BatchTime: selectedBatchTime,

      staffs: staffs.map(staff => ({
        StaffName: staff.StaffName
      }))
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving staffs', error });
  }
};

module.exports = {
  addScheduler,
  getAllSchedulers,
  getSchedulerById,
  updateScheduler,
  deleteScheduler,
  getStaffsByCourseAndBatch
}
