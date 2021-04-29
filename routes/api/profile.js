const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// GET api/profile/me
// GET current user's profile
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('User', ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({ msg: 'No profile for this user'})
        }

        res.json(profile);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// POST api/profile
// Create or update user profile
router.post('/', [auth, [
    check('status', 'Status is required')
        .not().isEmpty(),
    check('skills', 'Skills are required')
        .not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        linkedin,
        facebook,
        twitter,
        instagram,
        youtube
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.company = website;
    if(location) profileFields.company = location;
    if(bio) profileFields.company = bio;
    if(status) profileFields.company = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim())
    };

    // Build social object
    profileFields.social = {};
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(youtube) profileFields.social.youtube = youtube;

    try{
        let profile = await Profile.findOne({ user: req.user.id})

        if(profile){
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id}, 
                {$set: profileFields},
                { new: true}
            );

            return res.json(profile);
        }

        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
        
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error')
    }
    res.send(profileFields);
})

module.exports = router;