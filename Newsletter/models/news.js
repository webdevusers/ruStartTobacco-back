const {Schema, model} = require('mongoose')

const News = new Schema({
    email: String,
})

module.exports = model('News', News)