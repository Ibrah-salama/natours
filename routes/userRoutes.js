const express = require('express');
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')

const multer  = require('multer')
const upload = multer({ dest: './public/img/users' })

// mounting routers 
const router = express.Router()

//users

router.get('/me', authController.protect,userController.getMe , userController.getUser)
router.post('/signup',authController.signUp)
router.post('/login',authController.logIn)
router.get('/logout',authController.logout)
router.post('/forgotpassword',authController.forgotPassword)
router.patch('/resetpassword/:token',authController.resetPassword)

//Add protect controller as a middle ware to make the code more clean
// this middleware protect all the routes that comes after it
// thats beacause middlewares runs in sequence 
// thats why we removed authontroller.protect from them all
// v-164 
router.use(authController.protect)

router.patch('/updatemyPassword',authController.updatePassword)
router.patch('/updateme',userController.uploadUserPhoto, userController.resizeUserPhoto,userController.updateMe)
router.delete('/deleteme',userController.deleteMe)

// add middleware controller to give the admin the permission to do these actions
router.use(authController.restrictTo('admin'))

router.route('/').get(userController.getAllUsers).post(userController.createUser)
router.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser)

module.exports = router