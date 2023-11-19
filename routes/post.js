const express = require("express");
const { Post, Comment, User, Image } = require("../models");
const { isLoggedIn } = require("./auth");

const router = express.Router();

// 게시글 추가
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{ model: Image},{ model: Comment }, { model: User },
      ],
    });

    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 게시글 수정
router.patch("/", (req, res) => {
  res.json({ isOk: true, msg: "삭제 완료" });
});

// 게시글 삭제
router.delete("/", (req, res) => {
  res.json({ isOk: true, msg: "삭제 완료" });
});

// 댓글 추가
router.post("/:postId/comment", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
