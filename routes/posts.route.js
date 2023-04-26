const express = require('express');
const { Posts } = require("../models"); // Posts DB 임포트
const { Op } = require("sequelize");    // Op 임포트
const authMiddleware = require("../middlewares/auth-middleware"); // 사용자 인증 미들웨어 임포트
const router = express.Router();

// 게시글 생성
router.post("/posts", authMiddleware, async (req, res) => {
  // 게시글 생성하는 사용자 정보 가져오기
  // 게시글 생성자는 로그인한 사용자만 할 수 있기 때문에
  // 로그인된 사용자를 구분하기 위해서 사용자 인증 미들웨어를 사용할 것임
  // 그러기 위해서는 맨위에 const authMiddleware = require("../middlewares/auth-middleware"); 임포트
  // router.post("/posts", authMiddleware, ... )를 등록해야함
  const { userId } = res.locals.user;
  console.log( userId )

  // body 데이터에서 title, content 받아오고
  const { title, content } = req.body;

  // Posts DB에 생성
  const post = await Posts.create({
    UserId: userId,
    title,
    content,
  });

  return res.status(201).json({ data: post });
});


// 게시글 목록 조회
router.get("/posts", async (req, res) => {
  const posts = await Posts.findAll({
    attributes: ["postId", "title", "createdAt", "updatedAt"],
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({ data: posts });
});

// 게시글 상세 조회
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await Posts.findOne({
    attributes: ["postId", "title", "content", "createdAt", "updatedAt"],
    where: { postId }
  });

  return res.status(200).json({ data: post });
});


// 게시글 수정
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const { title, content } = req.body;

  // 게시글을 조회합니다.
  const post = await Posts.findOne({ where: { postId } });

  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  } else if (post.UserId !== userId) {
    return res.status(401).json({ message: "권한이 없습니다." });
  }

  // 게시글의 권한을 확인하고, 게시글을 수정합니다.
  await Posts.update(
    { title, content }, // title과 content 컬럼을 수정합니다.
    {
      where: {
        [Op.and]: [{ postId }, { UserId: userId }],
      }
    }
  );

  return res.status(200).json({ data: "게시글이 수정되었습니다." });
});


// 게시글 삭제
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  // 게시글을 조회합니다.
  const post = await Posts.findOne({ where: { postId } });

  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  } else if (post.UserId !== userId) {
    return res.status(401).json({ message: "권한이 없습니다." });
  }

  // 게시글의 권한을 확인하고, 게시글을 삭제합니다.
  await Posts.destroy({
    where: {
      [Op.and]: [{ postId }, { UserId: userId }],
    }
  });

  return res.status(200).json({ data: "게시글이 삭제되었습니다." });
});


module.exports = router;