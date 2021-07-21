const { User } = require("../models/User");

// 인증 처리 하는 곳
let auth = (req, res, next) => {
  // 클라이언트의 쿠키에서 TOKEN을 가져온다.
  let token = req.cookies.x_auth;

  // 토큰을 복호화하여 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if(!user) return res.json({ isAuth: false, error: true })

    req.token = token;
    req.user  = user;
    next();
  })

  // 있으면 OK, 없으면 Fail
}

module.exports = { auth };