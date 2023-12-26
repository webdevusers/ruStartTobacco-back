const Router = require('express')
const router = new Router()
const Subscribed = require('../models/news')

router.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password' 
    }
});

router.post('/create', async (req, res) => {
    const {email} = req.body;

    const item = await new Subscribed({
        email
    }).save()

    res.status(200).send({created: "true"})
})
router.post('/send', async (req, res) => {
    try {
        const subscribers = await Subscribed.find();

        for (const subscriber of subscribers) {
            const mailOptions = {
                from: 'your-email@gmail.com',
                to: subscriber.email,
                subject: 'Newsletter',
                text: 'Here is your newsletter!'
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(200).send({ sent: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;