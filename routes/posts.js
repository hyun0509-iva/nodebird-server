const express = require("express");
const { Post, Image, User, Comment } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"], // 댓글 정렬
      ],
      include: [
        {
          model: User, // 작성자 정보
          attributes: ["id"],
        },
        {
          model: Image, //이미지 정보
        },
        {
          model: Comment, //댓글 정보
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
      ],
    });
    console.log({ posts });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
