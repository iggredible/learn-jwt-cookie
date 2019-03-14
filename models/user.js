const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
  username: {
    type: String,
    index: true,
    unique: true,
    dropDups: true,
    required: true
  },
  passwordHash: {
    type: String,
    require: true
  }
});

const User = mongoose.model('User', userSchema);

const connectDb = () => {
  return mongoose.connect('mongodb://localhost:27017/ig-mongo', {useNewUrlParser: true, useCreateIndex: true});
}
module.exports = {User, connectDb};
