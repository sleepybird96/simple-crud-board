const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./router");

const port = 4000;


//body-parser설정
server.use(bodyParser.json());
//클라이언트에 해당하는 주소만 포함하고 get, post, put, delete, option메소드만 허용!
server.use(cors({
  "methods": "GET,PUT,POST,DELETE,OPTIONS",
  origin:"https://kogong.gsang2board.click",
  credentials:true
}));
//기록용
server.use(morgan('dev'));
//라우터사용
server.use('/posts', router);

server.listen(port, ()=>{
  console.log('server on 4000')
})