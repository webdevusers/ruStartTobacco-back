const express = require('express');
const router = express.Router();
const Review = require('../models/review')


router.post('/create', async (req, res) => {
    try {
        const { text, name } = req.body;

        const newReview = await new Review({
            text,
            name
        }).save()
        res.status(200).send({created: "true"})
    } catch(e) {
        console.log(e)
    }
})
router.get('/all', async (req, res) => {
    try {
        const items = await Review.find();

        res.status(200).send({ items });
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return res.status(404).send({ error: "Review not found" });
        }

        res.status(200).send({ deleted: true, deletedReview });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;