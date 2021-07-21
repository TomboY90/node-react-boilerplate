const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const PORT = 3000;
const config = require('./config/key');

// Models
const { User } = require('./models/User');
const { auth } = require('./middleware/auth');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
.then(() => console.log('Mongoose Connected...'));

app.get('/', (req, res) => {
  res.send('Nodemon!')
})

app.post('/api/user/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).json({
      success: true
    })
  });
})

app.post('/api/user/signin', (req, res) => {
  // 요청한 이메일을 DB에서 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    // Not Exist User
    if (!user) {
      return res.json({
        loginSucess: false,
        message: '일치하는 아이디가 없습니다.'
      })
    }

    // 비밀번호가 같은지 확인한다
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSucess: false,
          message: '비밀번호가 틀렸습니다'
        })
      }

      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err);
        }

        // save token inside the cookie
        res.cookie('x_auth', user.token)
          .status(200)
          .json({
            loginSucess: true,
            userId: user._id
          })
      })
    })
  })
})

app.post('/api/user/auth', auth, (req, res) => {
  // 에러가 안나오고 이 콜백으로 온 것은 auth middleware 통과했다는 것
  res.status(200).json({
    _id: req.user._id,
    isAuth: true,
    isAdmin: req.user.role === 0 ? false : true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/user/signout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    })
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})