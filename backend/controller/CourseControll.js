const Course = require('../model/Course')


// http://localhost:5000/ADMIN/CourseDetails
const CourseDetails = async (req, res) => {
    const { code, cname, desc, check } = req.body;
    let ExistingCourse;
    try {
        ExistingCourse = await Course.findOne({ code: code });
    }
    catch (err) {
        console.log(err)
    }
    if (ExistingCourse) {
        return res.status(404).json({ message: 'Course Already Existed' })
    }
    const dis = new Course({
        code,
        cname,
        desc,
        check
    })
    try {
        await dis.save();
        
    } catch (err) {
        console.log(err)
    }

    return res.status(200).json({ dis })
}

// http://localhost:5000/ADMIN/CourseDisplay
const CourseDisplay = async (req, res) => {
    let got;
    try {
        got = await Course.find();
    } catch (err) {
        console.log(err)
    }
    if (!got) {
        return res.status(404).json({ message: 'Page Error' })
    }
    return res.status(200).json({ got })
}

// http://localhost:5000/ADMIN/CourseDelete/:id
const CourseDelete = async (req, res) => {
    let del;
    const id = req.params.id;
    try {
        del = await Course.findByIdAndDelete({ _id: id })

    } catch (err) {
        console.log(err)
    }
    if (!del) {
        return res.status(404).json({ message: "Not exist" });
    }
    res.status(200).json({ del });
}

// http://localhost:5000/ADMIN/CourseUpdate/:id
const CourseUpdate = async (req, res) => {
    try {
        const courseId = req.params.id;
        const { code, cname, desc, check } = req.body;
    
        if (!code || !cname || !desc) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
        const updatedCourse = await Course.findByIdAndUpdate(
          courseId,
          { code, cname, desc, check },
          { new: true }
        );
    
        if (!updatedCourse) {
          return res.status(404).json({ error: 'Course not found' });
        }
    
        return res.json({ message: 'Course updated successfully', updatedCourse });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
};

// GetTotalNoOfCourses:
const getTotalCourses = async (req, res) => {
    try {
      const totalCourses = await Course.countDocuments();
      res.json({ totalCourses });
    } catch (error) {
      console.error('Error fetching total Courses count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// GetCourseData :
  const getCourseData = async (req, res) => {
    try {
      const courses = await Course.find({},'code cname');
  
      res.json({ courseData: courses });
    } catch (error) {
      console.error('Error fetching course data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = {
    CourseDetails,
    CourseDisplay,
    CourseDelete,
    CourseUpdate,
    getTotalCourses,
    getCourseData,
}
