//로그인한 경우에만 접근
exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) { //인증된 상태
    next(); //다음 미들웨어로 넘어감
  } else {
    //인증되지 않은 상태
    res.status(401).send('로그인이 필요합니다.')
  }
}

//로그인하지 않는 경우에만 접근
exports.isNotLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) { //로그인하지 않은 상태
    next()
  } else {
    res.status(401).send('로그인하지 않은 사용자만 접근이 가능합니다.')
  }
}