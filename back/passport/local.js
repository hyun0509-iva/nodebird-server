const passport = require("passport");
const bcrypt = require("bcrypt");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", //req.body.email
        passwordField: "password",
      },
      async (email, passport, done) => {
        // 로그인 전략
        try {
          const user = await User.findOne({ where: { email } });
          if (!user) {
            return done(null, false, { reason: "존재하지 않는 사용자입니다." });
            // done(server error, success data, error.message)
          }
          const result = await bcrypt.compare(passport, user.password);
          if (result) {
            //비밀번호가 일치하면 사용자 정보 전달
            return done(null, user); //req.user 객체로 전달됨
          }
          return done(null, false, {
            reason: "비밀번호가 일치하지 않습니다.",
          });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
