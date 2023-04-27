const express = require('express');

const router = express.Router();
router.get("/", (req, res) => {
  res.json([
    { id: 1, title: "Hello", content: "안녕하세요" },
    { id: 2, title: "Good", content: "좋음" },
    { id: 3, title: "Bye", content: "잘가" },
  ]);
});
router.post("/", (req, res) => {
  res.json({isOk: true, msg: '추가 완료'})
});

router.patch("/", (req, res) => {
  res.json({isOk: true, msg: '삭제 완료'})
});
router.delete("/", (req, res) => {
  res.json({isOk: true, msg: '삭제 완료'})
});

module.exports = router;

