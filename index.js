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

passport.use(new LocalStrategy( async (username, password, done) => {
  try {
    const userDocument = await UserModel.findOne({username: username}).exec();
    const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);

    if (passwordsMatch) {
      return done(null, userDocument);
    } else {
      return done('Incorrect Username / Password');
    }
  } catch (error) {
    done(error);
  }
}));

// need to:
// 0. create fake user
// 1. create signup (/register)
// 2. create login (/login)


app.post('/login', (req, res, next) => {
  // TODO: Use passport to verify login for fake user1
  res.send('hey login');
});
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

