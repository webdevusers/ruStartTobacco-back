const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5177;

const productRouter = require('./Products/Router/Router')
const reviewRouter = require('./Reviews/router/router')

app.use(cors())
app.use(express.json())

app.use("/items", productRouter)
app.use("/review", reviewRouter)

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://starttobacco:B5cSRlXcGXZjj3on@ru-starttobacco.vvdabvs.mongodb.net/');
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});    } catch (e) {
        console.log(e)
    }
}
start();
