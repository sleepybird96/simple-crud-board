const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const https = require("https");
const router = require("./router");
const fs = require("fs")

const port = 4000;


//body-parser설정
server.use(bodyParser.json());
//클라이언트에 해당하는 주소만 포함하고 get, post, put, delete, option메소드만 허용!
server.use(cors({
  "Access-Control-Allow-Origin": "https://127.0.0.1:3000",
  "methods": "GET,PUT,POST,DELETE,OPTIONS"
}));
//기록용
server.use(morgan('dev'));
//라우터사용
server.use('/posts', router);
//https 통신 사용
https
  .createServer(
    {
      key: fs.readFileSync('/Users/parkjisang/Desktop/dev/key.pem', 'utf-8'),
      cert: fs.readFileSync('/Users/parkjisang/Desktop/dev/cert.pem', 'utf-8'),
    },
    server
  )
  .listen(port);