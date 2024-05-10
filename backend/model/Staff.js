const mongoose = require('mongoose')
const autoIncrement = require('mongoose-sequence')(mongoose);


const CountSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        required: true
    }
});

const CountModel = mongoose.model('StaffCounts', CountSchema);
const schema = mongoose.Schema;

const useschema = new schema({
    _id: Number,
    Fname: {
        type: String,
        required: true
    },
    Lname: {
        type: String,
        required: true
    },
    Gender: {
        type: String,
        required: true
    },
    DateOfBirth: {
        type: String,
        required: true
    },
    BloodGroup: {
        type: String,
        required: true
    },
    Qualification: {
        type: String,
        required: true
    },
    Course: {
        type: [String],
        required: true
    },
    Batch: {
        type: [String],
        required: true
    },
    BatchTime: {
        type: [String],
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Phone: {
        type: Number,
        required: true
    },
},
    { _id: false }
)
mongoose.model('Staffs', useschema)

useschema.plugin(autoIncrement, { id: 'Staff_id', inc_field: '_id' });
useschema.pre('save', async function (next) {
    try {
        const count = await CountModel.findOneAndUpdate({ _id: 'Staff_Id' }, { $inc: { seq: 1 } }, { upsert: true, new: true });
        this._id = count.seq;
        next();
    } catch (error) {
        next(error);
    }
});


module.exports = {
    Staff: mongoose.model('Staff', useschema),
    Id: mongoose.model('StaffCounts', CountSchema)
}
