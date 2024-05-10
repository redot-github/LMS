const {Staff} = require('../model/Staff')
// const Login = require('../model/Login')
const jwt = require('jsonwebtoken')
const JWT_Key = 'RedotSolution'
const Batch = require('../model/Batch')
const {Student} = require('../model/Student')
// const bcrypt = require('bcryptjs')

// http://localhost:5000/ADMIN/StaffDetails
const StaffDetails = async (req, res) => {
    const { Fname, Lname, Gender, DateOfBirth, BloodGroup, Qualification, Course,Batch,BatchTime , Address, Email, Password, Phone } = req.body;

    let ExistingUser;
    try {
        ExistingUser = await Staff.findOne({ Email: Email });
    }
    catch (err) {
        console.log(err)
    }
    if (ExistingUser) {
        return res.status(404).json({ message: 'User Already Existed' })
    }
    const dis = new Staff({
        Fname,
        Lname,
        Gender,
        DateOfBirth,
        BloodGroup,
        Qualification,
        Course,Batch,BatchTime ,
        Address,
        Email,
        Password,
        Phone,
    })

    try {
        await dis.save();
    }
    catch (err) {
        console.log(err)
    }
    return res.status(200).json({ dis })
}

const StaffUsers = async (req, res) => {
    const {Email,Password} = req.body;
    let ExistingUser;
    try {
        ExistingUser = await Users.findOne({ Email: Email });
    }
    catch (err) {
        console.log(err)
    }
    if (ExistingUser) {
        return res.status(404).json({ message: 'User Already Existed' })
    }
    const dis = new Users ({
    Email,Password
    })

    try {
        await dis.save();
    }
    catch (err) {
        console.log(err)
    }
    return res.status(200).json({ dis })
}



// http://localhost:5000/ADMIN/StaffDisplay
const StaffDisplay = async (req, res) => {
    let got;
    try {
        got = await Staff.find();
    } catch (err) {
        console.log(err)
    }
    if (!got) {
        return res.status(404).json({ message: 'Page Error' })
    }
    return res.status(200).json({ got })
}

// http://localhost:5000/ADMIN/StaffDelete/:id
const StaffDelete = async (req, res) => {
    let del;
    const id = req.params.id;
    try {
        del = await Staff.findByIdAndDelete({ _id: id })

    } catch (err) {
        console.log(err)
    }
    if (!del) {
        return res.status(404).json({ message: "Not exist" });
    }
    res.status(200).json({ del });
}

// http://localhost:5000/ADMIN/StaffUpdate/:id
const StaffUpdate = async (req, res) => {
    try {
        const StaffId = req.params.id;
        const { Fname, Lname, Gender, DateOfBirth, BloodGroup, Qualification, Address, Email, Password, Phone } = req.body;

        if (!Fname || !Lname || !Gender || !DateOfBirth || !BloodGroup || !Qualification || !Address || !Email || !Phone || !Password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const updatedStaff = await Staff.findByIdAndUpdate(
            StaffId,
            { Fname, Lname, Gender, DateOfBirth, BloodGroup, Qualification, Address, Email, Password, Phone },
            { new: true }
        );

        if (!updatedStaff) {
            return res.status(404).json({ error: 'Staff Detail not found' });
        }

        return res.json({ message: 'Staff Detail updated successfully', updatedStaff });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// GetTotalNoOfStaffs:
const getTotalStaffs = async (req, res) => {
    try {
      const totalStaffs = await Staff.countDocuments();
      res.json({ totalStaffs });
    } catch (error) {
      console.error('Error fetching total Staffs count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// http://localhost:5000/ADMIN/Profile
const StaffProfile = async (req, res) => {
    const userId = req.id;
    let user;
    try {
        user = await Staff.findById(userId, '-Password');
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
    if (!user) {
        return res.status(404).json({ message: 'User Not Found' });
    }
    return res.status(200).json({ user });
}

// http://localhost:5000/ADMIN/Get/:coursecode
const GetCourse = async (req, res) => {
    const courseCode = req.params.coursecode; 
       try {
        const batches = await Batch.find({coursecode: courseCode});

        if (!batches || batches.length === 0) 
        {
            return res.status(404).json({ message: 'No batches found for the specified coursecode' });
        }

        const mappedBatches = batches.map(batch => ({
            Course: batch.coursecode,
            BatchType: batch.batchtype,
            BatchIntime: batch.batchIntime,
            BatchOuttime: batch.batchOuttime
        }));

        return res.status(200).json(mappedBatches);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const GetCourses = async (req, res) => {
    const userId = req.params.coursecode;
    try {
        const uniqueCourseCodes = await Batch.distinct('coursecode', { userId: userId });

        if (!uniqueCourseCodes || uniqueCourseCodes.length === 0) {
            return res.status(404).json({ message: 'No unique coursecodes found for the user' });
        }

        const mappedCourses = [];
        for (const courseCode of uniqueCourseCodes) {
            const batch = await Batch.findOne({ userId: userId, coursecode: courseCode });
            if (batch) {
                mappedCourses.push({
                    Course: batch.coursecode,
                    BatchType: batch.batchtype,
                    batchInTime: batch.batchIntime,
                    batchOutTime: batch.batchOuttime
                });
            }
        }

        return res.status(200).json(mappedCourses);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// http://localhost:5000/ADMIN/StaffData/:id
const GetStaff= async (req,res)=> {
    const Id = req.params.id;
    let Get;
    let Students;
    const {Course,BatchIntime,BatchOuttime} = req.body;
    try{
        Get = await Staff.findById(Id)
        // Students = await Student.find(Course,BatchIntime,BatchOuttime);
    }
    catch (err) {
        return new Error(err)
    }
    if (!Get) {
        return res.status(404).json({ message: 'User Not Found' })
    }
    
    return res.status(200).json({ Get })
}

module.exports = {
    StaffDetails,
    StaffDisplay,
    StaffDelete,
    StaffUpdate,
    StaffProfile,
    GetCourses,
    GetCourse,
    getTotalStaffs,
    StaffUsers,
    GetStaff
}   