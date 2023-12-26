const {Schema, model} = require('mongoose')

const Order = new Schema({
    name: String,
    surname: String,
    typeDelivery: String,
    deliveryAddress: String,
    typePayment: String,
    phone: String,
    status: String,
    order: Array,
})

module.exports = model('Order', Order)