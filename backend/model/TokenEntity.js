const mongoose = require('mongoose')

const schema = mongoose.Schema

const Tokens = new schema({
    Email: {
        type: String,
    },
    Token: {
        type: String
    },
    CreatedAt: {
        type: Date
    },
    ExpiryAt: {
        type: Date
    }
})

module.exports = mongoose.model('Token', Tokens)

