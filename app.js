// mode을 이용해 테이블 생성하는 코드

// const { sequelize } = require('./models/index.js');

// async function main() {
//   // model을 이용해 데이터베이스에 테이블을 삭제 후 생성합니다.
//   await sequelize.sync({ force: true });
// }

// main();


// 로그인, 회원가입부터 초기화

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cookieParser());
app.use('/api', []);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
})