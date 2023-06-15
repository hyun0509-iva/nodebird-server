const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const { User } = require("../models");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 12); //10 ~ 13 숫자를 높을 수록 보안성이 좋으나 시간이 오래걸림
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    next(error); // status 500
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, message) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (message) {
      return res.status(401).json(message.reason);
    }
    return req.login(user, async (loginError) => {
      if (loginError) {
        //passport쪽 에러
        console.error(loginError);
        return next(loginError);
      }
      return res.json(user);
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logOut();
  req.session.destroy(); // 세션에 담긴 사용자 정보 삭제
  res.send("ok");
});

module.exports = router;
