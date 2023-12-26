const Order = require('../models/Order')

class OrderController {
    async create(req, res) {
        try {
            const {
                name,
                surname,
                typeDelivery,
                deliveryAddress,
                typePayment,
                phone,
                status,
                order
            } = req.body;

            if (!name && !surname) {
                res.status(400).json({client: 'empty'})
            }
            const createorder = await new Order({
                name,
                surname,
                typeDelivery,
                deliveryAddress,
                typePayment,
                phone,
                status: "Не просмотрено",
                order
            }).save()
            res.status(200).json({order: "created"})
        } catch(e) {
            console.log(e)
        }
    }
    async get(req, res) {
        try {
            const Orders = await Order.find();
            res.status(200).json({Orders})
        } catch(e) {
            console.log(e)
        }
    }
    async getUnviewed(req, res) {
        try {
            const unviewedOrders = await Order.find({ status: "Не просмотрено" });
            res.status(200).json({ Orders: unviewedOrders });
        } catch(e) {
            console.log(e);
        }
    }
    
}

module.exports = new OrderController();