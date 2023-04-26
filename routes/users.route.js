const express = require('express');
const jwt = require('jsonwebtoken');
const { Users, UserInfos } = require("../models");
const router = express.Router();

// 회원가입
router.post("/users", async (req, res) => {
  const { email, password, name, age, gender, profileImage } = req.body;
  const isExistUser = await Users.findOne({ where: { email } });

  if (isExistUser) {
    return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
  }

  // Users 테이블에 사용자를 추가합니다.
  const user = await Users.create({ email, password });
  // UserInfos 테이블에 사용자 정보를 추가합니다.
  const userInfo = await UserInfos.create({
    UserId: user.userId, // 생성한 유저의 userId를 바탕으로 사용자 정보를 생성합니다.
    name,
    age,
    gender: gender.toUpperCase(), // 성별을 대문자로 변환합니다.
    profileImage
  });

  return res.status(201).json({ message: "회원가입이 완료되었습니다." });
});

// 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email } });
  if (!user) {  // 해당 사용자 존재?
    return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
  } else if (user.password !== password) {  // 해당 사용자의 비밀번호 존재?
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  const token = jwt.sign({  // jwt 생성
    userId: user.userId
  }, "customized_secret_key");
  res.cookie("authorization", `Bearer ${token}`); // cookie 발급 -> res 할당
  return res.status(200).json({ message: "로그인 성공" });
});

module.exports = router;