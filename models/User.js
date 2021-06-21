const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 20,
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minLength: 5
  },
  lastName: {
    type: String,
    maxLength: 20
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
});

// encrypt password
userSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
  
      // change plain password to hashed password
      bcrypt.hash(user.password, salt, function (error, hash) {
        if (error) return next(error);

        user.password = hash;
        next();
      })
    })
  }
  else {
    next();
  }
})

const User = mongoose.model('User', userSchema);

module.exports = {
  User
}