const { Schema, model } = require('mongoose')

const Blog = new Schema({
    showtitle: {type: String},
    showdesc: {type: String},
    images: {type: Array},
    textforpage: {type: String},
    urlLink: {type: String}
})
module.exports = model('Blog', Blog)
