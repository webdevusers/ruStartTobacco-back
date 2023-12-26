const { Schema, model } = require('mongoose')

const Msg = new Schema({
    name: { type: String},
    phone: {type: String},
    fullName: {type: String},
    text: {type: String}
})
module.exports = model('Msg', Msg)