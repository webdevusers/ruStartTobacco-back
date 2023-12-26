const {Schema, model} = require('mongoose')

const User = new Schema({
    name: {
        type: String, 
        required: true
    },
    surname: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        ref: 'Role'
    }],
    views: [{
        type: Object,
    }],
    liked: [{
        type: Object,
    }],
    orders: [{
        type: Object,
    }],
})

module.exports = model('User', User)