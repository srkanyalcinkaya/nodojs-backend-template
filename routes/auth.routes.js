const express = require("express");
const { loginController, registerController, verifyEmailController } = require("../controllers/auth.controller");

// router onject
const router = express.Router();


// register || POST
router.post('/register', registerController)

// login || POST
router.post('/login', loginController)

// Email Verification || GET
router.get('/verify-email/:_id', verifyEmailController)



module.exports = router