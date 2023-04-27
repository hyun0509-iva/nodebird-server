const express = require("express");
const postRouter = require("./routes/post");
const app = express();

app.get("/api", (req, res) => {
  res.send("hello express");
});

app.use("/api/posts", postRouter);

app.listen(3082, () => {
  console.log("서버 실행 중!, \nrun server at: http://localhost:3082/api");
});
