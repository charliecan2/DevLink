const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');
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

// DELETE api/profile
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

// PUT api/profile/experience
router.put('/experience', [auth, [
    check('title', 'Title is required')
        .not()
        .isEmpty(),
    check('company', 'Company is required')
        .not()
        .isEmpty(),
    check('location', 'Location is required')
        .not()
        .isEmpty(),
    check('from', 'Start date is required')
        .not()
        .isEmpty()
]],
async (req, res) => {
    const errors = validationResult(req);
    const { title, company, location, from, to, current } = req.body;

    if(!errors.isEmpty){
        return res.status(400).json({ errors: errors.array() });
    }

    const newExperience = {
        title,
        company,
        location,
        from,
        to,
        current
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.experience.unshift(newExperience); 
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


// DELETE api/profile/experience/:exp_id
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = Profile.findOne({ id: req.user.id });

        const removeIndex = profile.experience.map(exp => exp.id).indexOf(req.params.exp_id);
    
        profile.experience.splice(removeIndex, 1);
        await profile.save();
    
        res.json(profile);  
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT api/profile/education
router.put('/education', [auth, [
    check('school', 'School is required')
        .not()
        .isEmpty(),
    check('degree', 'Degree is required')
        .not()
        .isEmpty(),
    check('fieldofstudy', 'Field of Study is required')
        .not()
        .isEmpty(),
    check('from', 'Start date is required')
        .not()
        .isEmpty()
]],
async (req, res) => {
    const errors = validationResult(req);
    const { school, degree, fieldofstudy, from, to, current } = req.body;

    if(!errors.isEmpty){
        return res.status(400).json({ errors: errors.array() });
    }

    const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.education.unshift(newEducation);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


// DELETE api/profile/education/:ed_id
router.delete('/education/:ed_id', auth, async (req, res) => {
    try {
        const profile = Profile.findOne({ id: req.user.id });

        const removeIndex = profile.education.map(ed => ed.id).indexOf(req.params.ed_id);

        profile.education.splice(removeIndex, 1);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// GET api/profile/github/:username
// Get user repos from Github
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri: encodeURI(
              `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
            ),
            method: 'GET',
            headers: {
              'user-agent': 'node.js',
              Authorization: `token ${config.get('githubToken')}`
            }
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if(response.statusCode !== 200){
                return res.status(404).json({ msg: 'No Github profile found'});
            }

            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;