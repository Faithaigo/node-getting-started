const express = require('express');
const {check, body} = require('express-validator')

const authController = require('../controllers/auth');
const User =  require('../models/user')

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);
/**
 * Sanitizing data means storing it in a uniform format
 */
router.post('/login', [check('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
body('password',
    'Please enter a password with at least 5 characters'
    ).isLength({min:5}).isAlphanumeric().trim()], authController.postLogin);


router.post('/signup', 
[check('email').isEmail()
.withMessage('Please enter a valid email')
.custom((value, {req})=>{
    // if(value === 'test@test.com'){
    //     throw new Error('This email address is forbidden')
    // }
    // return true
    //express validator expects the custom package to return true/false or a promise with either success or error
    /**
     * Asynchronous validation - Not instant(it has to reach to the database)
     */
    return User.findOne({email:value}).then(userDoc=>{
        if(userDoc){
            return Promise.reject('Email exists already, please pick a different one')
        }
    })
}),
body('password',
'Please enter a password with only numbers and text and at least 5 characters'
).isLength({min:5}).isAlphanumeric(),
body('confirmPassword').custom((value, {req})=>{
    if(value !== req.body.password){
        throw new Error('Passwords have to match!')
    }
    return true
})
], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;