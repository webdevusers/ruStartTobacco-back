const express = require('express');
const router = express.Router();
const Message = require('../models/Message')

router.post('/create', async (req, res) => {
    try {
        const { name, phone, fullName, text } = req.body;

        const newMsg = await new Message({
            name,
            phone,
            fullName,
            text
        }).save();

        res.status(201).send({
            created: true
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            error: 'Internal Server Error'
        });
    }
});
router.get('/all', async (req, res) => {
    try {
        const items = await Message.find();

        res.status(200).send({ items });
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedMessage = await Message.findByIdAndDelete(id);

        if (!deletedMessage) {
            return res.status(404).send({ error: "Message not found" });
        }

        res.status(200).send({ deleted: true, deletedMessage });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;