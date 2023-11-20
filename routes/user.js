const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const { User, Post } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./auth");

const router = express.Router();

router.post("/", isNotLoggedIn, async (req, res, next) => {
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

router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      // 사용자 정보 가공하기.
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"], //제외시킬 User 필드
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
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

      // 사용자 정보 가공하기.
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        // attributes: ['id', 'nickname', 'email'], //포함할 User 필드
        attributes: {
          exclude: ["password"], //제외시킬 User 필드
        },
        include: [
          {
            model: Post,
            //hasMany라서 이런식으로 작성하면 프론트측에서 복수형으로 me.Posts가 됨
          },
          {
            model: User,
            as: "Followings",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.send("ok");
  });
});

module.exports = router;
