const express = require('express')
const router = express.Router();
const authController = require('../controller/AuthController')

router.route('/')
.post(authController.Login)

router.route('/refresh')
.get(authController.refresh)

router.route('/logout')
.post(authController.Logout)

module.exports =router