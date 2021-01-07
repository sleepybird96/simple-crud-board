const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const port = 3000;

const ip = "127.0.0.1";

const data = {posts: []};
let id = 1;

//서버실행 확인
server.listen(port, () => {
  console.log(`server is running port: ${port}`)
})
//body-parser설정
server.use(bodyParser.json());
//모든 cors요청 승인
server.use(cors());

//라우터

//method: get ,url : '/' 
server.get('/', (req, res) =>{
  res.status(200).send(data);
})

//method: post, url : '/write'
//그냥 서버에서 아이디를 달아주기로 했다.
server.post('/write', (req, res) =>{
  req.body.id = id;
  id++;
  data.posts.unshift(req.body);
  res.status(201).send();
})

//method: post, url: '/modify' 
//수정할 게시물의 비밀번호 확인
server.post('/modify', (req, res) =>{
  const modIdx = data.posts.findIndex(el => el.id === req.body.id);
  if(req.body.password !== data.posts[modIdx].password){
    res.status(401).send();
  }else{
    res.status(200).send(data.posts[modIdx])
  }
})

//method: post, url: '/delete'
//삭제할 게시물의 비밀번호 확인
server.post('/delete', (req, res) =>{
  const rmIdx = data.posts.findIndex(el => el.id === req.body.id);
  if(req.body.password !== data.posts[rmIdx].password){
    res.status(401).send();
  }else{
    res.status(200).send()
  }
})

//method: put, url : '/modify'
server.put('/modify', (req, res) =>{
  const modIdx = data.posts.findIndex(el => el.id === req.body.id);
  data.posts[modIdx].password = req.body.password;
  data.posts[modIdx].title = req.body.title;
  data.posts[modIdx].article = req.body.article;
  res.status(200).send(data[modIdx])
})

//method: delete, url: '/delete'
server.delete('/delete', (req, res) => {
  const rmIdx = data.posts.findIndex(el => el.id === req.body.id);
  data.posts.splice(rmIdx, 1);
  res.status(200).send(data[rmIdx])
})