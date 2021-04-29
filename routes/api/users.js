const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/default.json');
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
    const { name, email, password } = req.body;

    if(!errors.isEmpty){
        return res.status(400).json({ errors: errors.array() });
    }

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

    // Creates a new user based values extracted from req.body    
        user = new User({
            name: name,
            email: email,
            password: password,
            avatar: avatar,
        })

    // Encrypt users password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
        
    // Creates jsonwebtoken (JWT)
        const payload = {
            user: {
                id: user.id
            }
        }
        
        jwt.sign(payload, config.jwtSecret, {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err;
            res.json({ token })
        });

    } catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
})

module.exports = router;