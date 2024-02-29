const express = require('express');
const router = express.Router();
const validate = require("../middleware/validate.js");
const verify = require("../middleware/verify.js");
const authController = require('../controllers/authController');
const { check } = require("express-validator");

router.post("/register",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("username")
        .not()
        .isEmpty()
        .withMessage("Your username is required")
        .trim()
        .escape(),
    check("phoneNumber")
        .notEmpty()
        .withMessage("Phone number is required")
        .isMobilePhone(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Must be at least 8 chars long"),
    validate,
    authController.register);

router.post("/login",
    check("username")
        .notEmpty()
        .withMessage("Username is required"),
    check("password").not().isEmpty(),
    validate,
    authController.login);

router.get('/logout', verify, authController.logout);
router.get('/me', verify, authController.me)

module.exports = router;