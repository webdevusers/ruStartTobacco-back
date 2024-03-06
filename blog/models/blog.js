const { Schema, model } = require('mongoose')

const Blog = new Schema({
    date: { type: String},
    image: {type: String},
    text: {type: String}
})
module.exports = model('Blog', Blog)