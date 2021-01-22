const express = require("express");
const router = express.Router();
const controler = require("../controler");

//모든 포스트 불러오기
router.get('/', controler.get);
//새로운 게시물 작성
router.post('/write' ,controler.write);
//수정할 때 패스워드 확인
router.post('/modify', controler.postPw);
//삭제할 때 패스워드 확인
router.post('/delete', controler.postPw);
//수정
router.put('/modify', controler.modify);
//삭제
router.delete('/delete', controler.delete)

module.exports = router;