const express = require('express')
const router = express.Router();
const user = require('./../models/user')
const bcrypt = require('bcrypt')
const passport = require('./../auth')



router.post('/signup', async (req, res) => {
  try {
    const newUser = req.body;
    const saveUser = new user(newUser);
    await saveUser.save();

    // Create session
    req.session.visited = true;
    req.session.user = {
      id: saveUser.id,
      username: saveUser.username
    };

    res.status(201).json({ message: 'User created successfully', user: req.session.user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal error' });
  }
});


router.post('/login',
  passport.authenticate('local', { failureRedirect: '/user/login', failureMessage: true }),
  (req, res) => {
    // Create session
    req.session.visited = true;
    req.session.user = {
      id: req.user.id,
      username: req.user.username
    };

    res.redirect('http://localhost:3000/user/' + req.user.username);
  });

  router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ error: 'Failed to log out' });
      }
      res.clearCookie('connect.sid'); // This clears the session ID cookie
      res.redirect('/user/login');
    });
  });



module.exports = router