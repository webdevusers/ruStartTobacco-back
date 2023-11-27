const { Schema, model } = require('mongoose')

const Section = new Schema({
    sectionName: { required: true, type: String },
    category: Schema.Types.ObjectId,
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
})
module.exports = model('Section', Section)