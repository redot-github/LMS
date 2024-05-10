const mongoose = require('mongoose')

const schema = mongoose.Schema;

const useschema = new schema({
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    check: {
        type: Boolean,
    }
})


const Users = new schema({
    Name: {
        type: String
    },
    Email: {
        type: String,
    },
    Password: {
        type: String
    }
}

)
module.exports = {
    Login: mongoose.model('Login', useschema),
    User: mongoose.model('Admins', Users)
}
