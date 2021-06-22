const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

// password check
userSchema.methods.comparePassword = function(plainPassword, cb) {
  // 암호화된 비밀번호와 같은지 체크
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return cb(err);

    return cb(null, isMatch);
  })
}

// token 생성
userSchema.methods.generateToken = function(cb) {
  const user = this;

  // generate token using jsonwebtoken
  const token = jwt.sign(user._id.toHexString(), 'secretToken');
  user.token = token;

  user.save(function(err, user) {
    if (err) {
      return cb(err)
    }

    cb(null, user)
  })
}

const User = mongoose.model('User', userSchema);

module.exports = {
  User
}