const Router = require('express')
const router = new Router()
const controller = require('../Controller/AuthController')

router.post('/registration', controller.registration)
router.post('/authorization', controller.authorization )
router.post('/changeRole', controller.changeRole)
router.get('/getall', controller.getUsers)
router.post('/like', controller.likedProduct)
router.post('/dislike', controller.dislikeProduct)
router.post('/get', controller.getUser)
router.post('/addOrder', controller.addOrder)
router.post('/edit', controller.editUser)
router.post('/getliked', controller.getFavoriteProducts)
router.post('/views/add', controller.addViews)
router.post('/getviews', controller.getViewedProducts)
module.exports = router;