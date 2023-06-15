const express = require("express");
const cors = require("cors");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const db = require("./models");
const passportConfig = require("./passport");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.err);
passportConfig();

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET
}));
app.use(passport.initialize())
app.use(passport.session())

app.get("/api", (req, res) => {
  res.send("hello express");
});

app.use("/api/posts", postRouter);
app.use("/api/user", userRouter);

app.listen(3082, () => {
  console.log("서버 실행 중!, \nrun server at: http://localhost:3082/api");
});
