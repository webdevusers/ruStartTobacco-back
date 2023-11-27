const { Schema, model } = require('mongoose')

const Review = new Schema({

    text: {type: String},
    name: {type: String}

})
module.exports = model('Review', Review)