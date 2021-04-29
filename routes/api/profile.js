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
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
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
        res.status(500).send('Server error');
    }
    res.send(profileFields);
});

// GET api/profiles
// Retrieves all profiles in the database
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// GET api/profile/user/:user_id
// Get profile by user id
router.get('/user/:user_id', async (req, res) => {
    try {
        const profiles = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        
        if(!profiles){
            return res.status(400).json({ msg: 'Profile not found'})
        }
        
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(400).json({ msg: 'Profile not found'})
        }
        res.status(500).send('Server Error')
    }
});

// DELETE api/profiles
// Deletes profile, user, and post
router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'User & profile removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

module.exports = router;