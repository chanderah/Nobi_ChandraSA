var router = require('express').Router();
const {body} = require('express-validator');
const {register} = require('../../../../controllers/v1/auth/registerController');
const {login} = require('../../../../controllers/v1/auth/loginController');

router.post('/register', [
    body('email',"Invalid email address")
    .notEmpty()
    .escape()
    .trim().isEmail(),
    body('password',"The Password must be of minimum 4 characters length").notEmpty().trim().isLength({ min: 4 }),
], register);


router.post('/login',[
    body('email',"Invalid email address")
    .notEmpty()
    .escape()
    .trim().isEmail(),
    body('password',"The Password must be of minimum 4 characters length").notEmpty().trim().isLength({ min: 4 }),
],login);

module.exports = router;