const password = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  password.serializeUser((user, done) => {
    // Strategy 성공 시 호출됨
    done(null, user.id);
  });

  password.deserializeUser(async (id, done) => {
    // 인증후, 매번 요청시 사용자 정보 복구
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user) //req.user에 담김
    } catch (err) {
      console.error(err);
      done(err);
    }
  });

  local();
};
