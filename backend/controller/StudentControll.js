const { Student } = require('../model/Student')
const { User } = require('../model/Login')
const jwt = require('jsonwebtoken')
const JWT_Key = 'Redot'
const Batch = require('../model/Batch')
const Student_Key = 'Students'

// const bcrypt = require('bcryptjs')

// http://localhost:5000/ADMIN/users
const Users = async (req, res) => {
	const { Email, Password } = req.body;

	let ExistingUser;
	try {
		ExistingUser = await User.findOne({ Email: Email });
	}
	catch (err) {
		console.log(err)
	}
	if (ExistingUser) {
		return res.status(404).json({ message: 'User Already Existed' })
	}
	const dis = new User({
		Email, Password
	})

	try {
		await dis.save();
	}
	catch (err) {
		console.log(err)
	}
	return res.status(200).json({ dis })
}



// http://localhost:5000/ADMIN/StudentDetails
const StudentDetails = async (req, res) => {
	const { Fname, Lname, Gender, DateOfBirth, BloodGroup, Qualification, Course, Batch, BatchTime, Address, Email, Password, Phone } = req.body;

	let ExistingUser;
	try {
		ExistingUser = await Student.findOne({ Email: Email });
	}
	catch (err) {
		console.log(err)
	}
	if (ExistingUser) {
		return res.status(404).json({ message: 'User Already Existed' })
	}
	const dis = new Student({
		Fname,
		Lname,
		Gender,
		DateOfBirth,
		BloodGroup,
		Qualification,
		Course, Batch, BatchTime,
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

// Student Display:
const StudentDisplay = async (req, res) => {
	let got;
	try {
		got = await Student.find();
	} catch (err) {
		console.log(err)
	}
	if (!got) {
		return res.status(404).json({ message: 'Page Error' })
	}
	return res.status(200).json({ got })
}

// http://localhost:5000/ADMIN/StudentDelete/:id
const StudentDelete = async (req, res) => {
	let del;
	const id = req.params.id;
	try {
		del = await Student.findByIdAndDelete({ _id: id })

	} catch (err) {
		console.log(err)
	}
	if (!del) {
		return res.status(404).json({ message: "Not exist" });
	}
	res.status(200).json({ del });
}

// http://localhost:5000/ADMIN/StudentUpdate/:id
const StudentUpdate = async (req, res) => {
	try {
		const studentId = req.params.id;
		const { Fname, Lname, Gender, DateOfBirth, BloodGroup, Qualification, Address, Email, Password, Phone } = req.body;

		if (!Fname || !Lname || !Gender || !DateOfBirth || !BloodGroup || !Qualification || !Address || !Email || !Phone || !Password) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		const updatedStudent = await Student.findByIdAndUpdate(
			studentId,
			{ Fname, Lname, Gender, DateOfBirth, BloodGroup, Qualification, Address, Email, Password, Phone },
			{ new: true }
		);

		if (!updatedStudent) {
			return res.status(404).json({ error: 'Student Detail not found' });
		}

		return res.json({ message: 'Student Detail updated successfully', updatedStudent });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

// GetTotalNoOfStudents:
const getTotalStudents = async (req, res) => {
	try {
		const totalStudents = await Student.countDocuments();
		res.json({ totalStudents });
	} catch (error) {
		console.error('Error fetching total Students count:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

// CountCyber:
const CountCyber = async (req, res) => {
	try {
		// const { Course } = req.body;
		// console.log(req.body,'---body')
		const Courses = await Student.find({}).lean()
		// console.log(Courses,'--courses')
		return res.status(200).json({ Courses });

	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const GetStudent = async (req, res) => {
	const Id = req.params.id;
	let Get;
	try {
		Get = await Student.findById(Id)
	}
	catch (err) {
		return new Error(err)
	}
	if (!Get) {
		return res.status(404).json({ message: 'User Not Found' })
	}

	return res.status(200).json({ Get })
}

// http://localhost:5000/ADMIN/Profile
const StudentProfile = async (req, res) => {
	const userId = req.id;
	let user;
	try {
		user = await Student.findById(userId, '-Password');

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
		const batches = await Batch.find({ coursecode: courseCode });

		if (!batches || batches.length === 0) {
			return res.status(404).json({ message: 'No batches found for the specified coursecode' });
		}

		const mappedBatches = batches.map(batch => ({
			Course: batch.coursecode,
			BatchType: batch.batchtype,
			BatchTime: `${batch.batchIntime} to ${batch.batchOuttime}`
		}));

		return res.status(200).json(mappedBatches);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
//http:localhost:5000/ADMIN/Batches
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
					// BatchTime: `${batch.batchIntime} to ${batch.batchOuttime}`
				});
			}
		}

		return res.status(200).json(mappedCourses);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

// http://localhost:5000/ADMIN/getCourseStudentCount:
const getCourseStudentCount = async (req, res) => {
	try {
		const courseStudentCounts = await Student.aggregate([
			{ $group: { _id: '$Course', count: { $sum: 1 } } }
		]);

		res.json({ courseStudentCounts });
	} catch (error) {
		console.error('Error fetching course student counts:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
const StudentLogin = async (req, res) => {
	const { Email, Password } = req.body;

	// Validation: Check if Email and Password are provided
	if (!Email || !Password) {
		return res.status(400).json({ message: 'Email and Password are required' });
	}

	try {
		let existingUsers;

		// Fetch all users
		existingUsers = await Student.find({}, 'Email Password').lean();

		// Check if any user with the given email exists
		const existingUser = existingUsers.find(user => user.Email === Email);

		if (!existingUser) {
			return res.status(404).json({ message: 'User Not Found' });
		}

		// Compare Passwords
		const isPasswordCorrect = (Password === existingUser.Password);

		if (!isPasswordCorrect) {
			return res.status(401).json({ message: 'Invalid Password' });
		}

		// Generate JWT token
		const token = jwt.sign({ id: existingUser._id }, Student_Key, { expiresIn: '1hr' });

		// Cookie - GMT to IST:
		const istOffset = 5.5 * 60 * 60 * 1000;
		const istNow = new Date(Date.now() + istOffset);

		// Set cookie
		res.cookie(String(existingUser._id), token, {
			path: '/',
			expires: new Date(istNow.getTime() + 1000 * 30),
			httpOnly: true,
			sameSite: 'lax'
		});

		// Return success response
		return res.status(200).json({ message: 'Logged in Successfully', student: existingUser, token });
	}
	catch (err) {
		// Handle any other errors
		console.error('Login Error:', err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
}

const StudentRefresh = async (req, res, next) => {
	const cookies = req.headers.cookie;
	if (!cookies) {
		return res.status(400).json({ message: "No cookies found in the request headers" });
	}
	const tokenPair = cookies.split("=");
	if (tokenPair.length < 2) {
		return res.status(400).json({ message: "Invalid cookie format" });
	}
	const Prevtoken = tokenPair[1];
	jwt.verify(String(Prevtoken), Student_Key, async (err, user) => {
		if (err || !user) {
			return res.status(403).json({ message: "Authentication Failed" });
		}

		try {
			const token = jwt.sign({ id: user.id }, Student_Key, { expiresIn: '1hr' });
			console.log("Regenerate Token", token);
			res.cookie(String(user.id), token, {
				path: '/',
				expires: new Date(Date.now() + 1000 * 60 * 60),
				httpOnly: true,
				sameSite: 'lax'
			});
			return res.status(200).json({ token, message: 'Token Refreshed Successfully' });
		} catch (error) {
			console.error('Error generating token:', error);
			return res.status(500).json({ message: "Internal Server Error" });
		}
	});
};


const StudentVerify = async (req, res, next) => {
	const cookies = req.headers.cookie;
	console.log(cookies, '----Cookies');

	const token = cookies ? cookies.split("=")[1] : null;
	console.log(token, '------token');

	if (!token) {
		return res.status(404).json({ message: "No Token Found" });
	}

	jwt.verify(String(token), Student_Key, (err, user) => {
		if (err) {
			console.error('Error verifying token:', err);
			return res.status(400).json({ message: "Unauthorized" });
		}

		console.log(user.id);
		req.id = user.id;
		next();
	});
};

const StudentGetUser = async (req, res, next) => {
	const UserId = req.id;
	try {
		const user = await Student.findById(UserId, '-password');
		if (!user) {
			return res.status(404).json({ message: "User Not Found" });
		}
		return res.status(200).json({ user });
	} catch (err) {
		console.error('Error fetching user:', err);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const StudentLogout = async (req, res, next) => {
	const cookies = req.headers.cookie;
	const tokenPair = cookies.split("=")[1];
	if (!tokenPair) {
		return res.status(400).json({ message: "Could not Find Token" });
	}
	jwt.verify(String(tokenPair), Student_Key, async (err, user) => {
		if (err || !user) {
			return res.status(403).json({ message: "Authentication Failed" });
		}
		res.clearCookie(`${user.id}`);
		return res.status(200).json({ message: "Successfully Logged Out" })
	})

}

module.exports = {
	StudentDetails,
	StudentDisplay,
	StudentDelete,
	StudentUpdate,
	StudentProfile,
	GetCourses,
	GetCourse,
	getTotalStudents,
	CountCyber,
	Users, StudentLogin,
	GetStudent,
	getCourseStudentCount,
	StudentLogin,
	StudentGetUser,
	StudentVerify,
	StudentRefresh,
	StudentLogout
}
