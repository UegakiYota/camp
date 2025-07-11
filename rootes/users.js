const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const flash = require('connect-flash');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req,res) => {
    try{
        const { email, username, password} = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success', 'Welcome!!');
        res.redirect('/campground');
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
});

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {

});


module.exports = router;