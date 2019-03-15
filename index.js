const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const JWTStrategy = require('passport-jwt').Strategy;

const {User, connectDb} = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(passport.initialize());

passport.use(new LocalStrategy(
  (username, password, done) => { // username, password are body of POST request
    User.findOne({ username: username }, async (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, /* {message: 'no user found'} message will be displayed on UI? */);
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (passwordMatch) {
        return done(null, user); // user gets passed down to req.user
      } else {
        // return done('password dont match'); // this returns HTML that says password dont match
        done(null, false, {message: 'password not matching'});
      }
    });
  }
));

app.post(
  '/login',
  passport.authenticate('local', {session: false}),
  (req, res, next) => {
    const authenticatedUser = req.user;
    res.json({
      message: 'login successful',
      user: authenticatedUser
    });
});

app.get('/', (req, res, next) => {
  res.send('hey root');
})
const createFakeUser = async () => {
  const passwordHash1 = await bcrypt.hash('password1', 10);  
  const user1 = new User({
    username: 'iggy1',
    passwordHash: passwordHash1
  })

  await user1.save();
}

connectDb().then(async () => {
  await User.deleteMany({});
  
  createFakeUser();

  app.listen(PORT, () => {
    console.log('Connected to port ', PORT);
  });
});

