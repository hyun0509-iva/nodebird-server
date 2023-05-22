const express = require("express");
const cors = require("cors");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const db = require("./models");

const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.err);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.send("hello express");
});

app.use("/api/posts", postRouter);
app.use("/api/user", userRouter);

app.listen(3082, () => {
  console.log("서버 실행 중!, \nrun server at: http://localhost:3082/api");
});
