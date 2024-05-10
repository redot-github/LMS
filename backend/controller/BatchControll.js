const Batch = require('../model/Batch')

const course = require('../model/Course')

// http://localhost:5000/ADMIN/BatchDetails
const BatchDetails = async (req, res) => {

    let dis
    const { batchtype, batchIntime, batchOuttime, coursecode } = req.body;
    try {
        dis = new Batch({
            batchtype, batchIntime, batchOuttime, coursecode
        })
        await dis.save();
    } catch (err) {
        console.log(err)
    }

    return res.status(200).json({ dis })
}

const Courses = async(req,res)=>{
try{
const coursecode = await Batch.find({}).lean()
return res.status(200).json({coursecode})
}
catch(err){
    console.log(err)
}
    return res.status(500).json({message: "internal Server Error"})
 }


// http://localhost:5000/ADMIN/BatchDisplay
const BatchDisplay = async (req, res) => {

    let got;
    try {
        got = await Batch.find();
    } catch (err) {
        console.log(err)
    }
    if (!got) {
        return res.status(404).json({ message: 'Page Error' })
    }
    return res.status(200).json({ got })
}

// http://localhost:5000/ADMIN/BatchDelete/:id
const BatchDelete = async (req, res) => {

    let del;
    const id = req.params.id;
    try {
        del = await Batch.findByIdAndDelete({ _id: id })

    } catch (err) {
        console.log(err)
    }
    if (!del) {
        return res.status(404).json({ message: "Not exist" });
    }
    res.status(200).json({ del });
}

//http://localhost:5000/ADMIN/GetBatch
const GetBatch = async (req, res) => {
    
    const userId = req.params.code;

    try {
        const courses = await course.find({ userId: userId });
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: 'User not Found' });
        }

        const mappedCourses = courses.map(course => ({ Code: course.code, CourseName: course.cname }));

        return res.status(200).json(mappedCourses);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// http://localhost:5000/ADMIN/BatchUpdate/:id
const BatchUpdate = async (req, res) => {
    try {
        const batchId = req.params.id;
        const { batchtype, batchIntime, batchOuttime, coursecode } = req.body;

        if (!batchtype || !batchIntime || !batchOuttime || !coursecode) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const updatedBatch = await Batch.findByIdAndUpdate(
            batchId,
            { batchtype, batchIntime, batchOuttime, coursecode },
            { new: true }
        );

        if (!updatedBatch) {
            return res.status(404).json({ error: 'Course not found' });
        }

        return res.json({ message: 'Course updated successfully', updatedBatch });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// GetTotalNoOfBatchs:
const getTotalBatches = async (req, res) => {
    try {
      const totalBatches = await Batch.countDocuments();
      res.json({ totalBatches });
    } catch (error) {
      console.error('Error fetching total Batches count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = {
    BatchDetails,
    BatchDisplay,
    BatchDelete,
    BatchUpdate,
    GetBatch,
    getTotalBatches,
    Courses
}
