const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');

// POST to api/users with a User

router.post('/', 
[
check('name', 'Name is required')
    .not()
    .isEmpty(),
check('email', 'Email is required')
    .isEmail(),
check('password', 'Please enter a password that is 6 characters or longer')
    .isLength({
        min: 6
    })
],
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
    // See if user exists
        let user = await User.findOne({ email });

        if (user){
            return res.status(400).json({ errors: [{msg: 'User already exists'}] })
        }
        
    // Get users gravitar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })
    // Encrypt users password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
        
    // Return json webtoken
        res.send('User registered');

    } catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
})

module.exports = router;