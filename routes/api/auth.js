const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/default.json');
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');

// GET api/auth
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        res.json(user)
    } catch(err){
        if (err) throw err;
        res.send(500).send('Server error');
    }
});

// Authenticate user & get token
router.post('/', 
[
check('email', 'Email is required')
    .isEmail(),
check('password', 'Password is required')
    .exists()
],
async (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
    // See if user exists
        let user = await User.findOne({ email });

        if (!user){
            return res.status(400).json({ errors: [{msg: 'Invalid credentials'}] })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch){
            return res.status(400).json({ errors: [{msg: 'Invalid credentials'}] })
        }
        
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
            res.json({ token });
        });

    } catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;