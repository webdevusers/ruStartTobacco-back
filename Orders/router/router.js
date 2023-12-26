const Router = require('express')
const router = new Router()
const controller = require('../controller/controller')

router.post('/create', controller.create)
router.get('/get', controller.get)

module.exports = router;