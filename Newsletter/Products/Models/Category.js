const { Schema, model } = require('mongoose')

const Category = new Schema({
    title: {unique: true, required: true, type: String},
    image: {type: String, required: true},
    sections: [{type: Schema.Types.ObjectId, ref: 'Section'}],
    urlLink: String
})
module.exports = model('Category', Category)