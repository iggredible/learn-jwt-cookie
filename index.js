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
app.use(passport.initialize());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      return done(null, user);
    });
  }
));

app.post('/login',
  passport.authenticate('local', {session: false}),
  (req, res, next) => {
    res.send('hey');
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

