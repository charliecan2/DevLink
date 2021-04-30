const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator/check');
const { remove } = require('../../models/Post');


// POST api/posts
// Create a post
router.post('/', [ auth, [
    check('text', 'Text is required')
        .not()
        .isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }

        const post = new Post(newPost);
        post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

// GET api/posts
// Get all posts
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1});

        res.json(posts);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

// GET api/posts/:id
// Get post by id
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({ msg: 'Post not found'});
        }

        res.json(post);
    } catch (error) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg: 'Post not found'});
        }
        res.status(500).send('Server error')
    }
});

// DELETE api/posts
// Delete a post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        
        if(!post){
            return res.status(404).json({ msg: 'Post not found'});
        }

        if(req.user.id != post.user){
            return res.status(401).json({ msg: 'User not authorized' })
        }

        await post.remove();

        res.json({ msg: 'Post removed'});
    } catch (error) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg: 'Post not found'});
        }
        res.status(500).send('Server error')
    }
});

// 
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({ msg: 'Post already liked'});
        }

        post.likes.unshift({ user: req.user.id})

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// 
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({ msg: 'Post not liked'});
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;