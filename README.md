# node.js로 CRUD api만들기 (express)
node.js로 API를 만들 때 보통은,  
생성되어있는 데이터를 요청을받아 던져주거나, 기존에 있던 데이터에 새롭게 생성하는 메소드를 먼저익힌다.  
하지만 http통신을 통해 업데이트요청과 특정데이터의 삭제요청도 가능한데,  
그것을 좀더 섬세하게 알아보고 간단한 api를 만들어보자.  
___
# 거시적인 구조  
우선 내가 만들 api에 사용할 메소드는,  
get post put 그리고 delete메소드다.  
|메소드|url|취하는 행동|
|---|---|---|
|GET|/|게시물 불러오기|
|POST|/write|새로운 게시물 작성|
|POST|/modify|수정할 때 패스워드 확인|
|POST|/delete|삭제할 때 패스워드 확인|
|PUT|/modify|수정할 게시물 제출|
|DELETE|/delete|게시물 삭제|  
  
  
HTTP의 각메소드의 용도에 맞게 서버를 만들어보자.  
___
  
## GET '/' 게시물 불러오기  
클라이언트가 GET요청을 보내면 내가 원하는 서버응답은,  
게시물에 담긴 내용들이다.  
내가 바라는 json형태로 된 게시물 폼은 이러하다.  
```
{
  "userId": "ㅇㅇ",
  "password": "1234",
  "title": "나루토 사스케 싸움수준 실화냐?",
  "article": "가슴이 웅장해진다..."
}
```
클라이언트에서 대충 게시물 규격에 맞춰서 보내주면 저런형태로  
전환돼서 보내질거다. (클라이언트를 만들 미래의 나야 부탁해!)  
data는 json형태로 보관되어 질것이고 저것이 여러개 있다면  
이런 형태가 되지않을까  
```
{
  posts:[
    {
      "id": 2,
      "userId": 'ㅇㅇ',
      "password": '1234',
      "title": 'dd',
      "article": 'afdasdfa'
    },
    {
      "id": 1,
      "userId": 'ㅇㅇ',
      "password": '1234',
      "title": '나루토 사스케 싸움수준 실화냐?',
      "article": '가슴이 웅장해진다...'
    }
  ]
}
```

그래서 '/'url에서 get요청의 반응으로 body로 보낼것은  
저 데이터 그 자체다.  

## POST 새로운 게시물 작성  
GET에서 내가 원하는 형태의 요청을 적었다.  
저것 그대로,  
```
{
  "userId":  유저아이디,
  "password": 게시물비밀번호,
  "title": 제목,
  "article": 본문
}
```
이런형식의 요청을 body를 통해 전달받는다.  
  
## POST 수정, 삭제 비밀번호 확인  
클라이언트에서 수정이나 삭제버튼을 누르면, 비밀번호를 입력하라고 나올것이다.  
그것도 추후 클라이언트를 만들 나한테 맡긴다.  
그럼 요청의 body는 이런식으로 오길 나는 원한다.  
```
{
  "id": 게시물아이디, 
  "password": 게시물비밀번호
}
```
만약 url이 __modify__ 일 경우  
응답으로 해당게시물의 객체상태 데이터를 그대로 줄것이다.  
응답받은 게시물 데이터를 토대로 기존에 작성하던 폼을 유지시켜준다.  
  
만약 url이 __delete__ 일 경우  
클라이언트에서 정말로 삭제하시겠습니까? 하고 한번더 되물어볼것이다.  
응답에 보내는 body는 없다.  
  
## PUT 수정할 게시물 제출
클라이언트에서 원하는 형태로 게시물 수정을 마쳤다면,  
완료버튼을 누르는 순간 PUT요청이 갈것이다.  
PUT요청에서 실릴 body는 새로운 게시물 요청의 폼과 비슷하다.  
한번 설정한 비밀번호도 수정이가능할지 불가능할지 고민하다가, 그냥 수정가능으로 했다.
```
{
  "id": "1",
  "password": "1234"
  "title": "찐따가 맞았다..",
  "article": "그래도 가슴은 웅장하다"
}
```
다만 차이점은 서버에있는 데이터에 __해당 게시물id 로 찾아가서__ 데이터 수정을 거쳐야한다.  
해당 게시물 id로 찾아가는것은 최적화를 위해서 __이분탐색__ 을 통해 수행할 예정  

## DELETE 삭제할 게시물 삭제  
요청으로오는 바디의 데이터는 해당 게시물의 id뿐이다.  
```
{
  "id": 1
}
```

구조를 완성했으니, 코드를 짜보자.  
  
___
## node.js코드 (express)
```javascript
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
```

___
# postman test
지금 당장 클라이언트를 만들어볼수도 없는 노릇이기에  
내가 원하는 형태로 요청을 처리하는지 보자.  
  
## 불러오기 method: get ,url : '/' 
<a href="https://imgur.com/q7zV9Xz"><img src="https://i.imgur.com/q7zV9Xz.png" title="source: imgur.com" /></a>

get요청을 보내준다.  
응답은
<a href="https://imgur.com/7uKpRCw"><img src="https://i.imgur.com/7uKpRCw.png" title="source: imgur.com" /></a>

아직 포스트한 데이터가 없다.

## 작성 method: post, url : '/write'
<a href="https://imgur.com/azr1IRg"><img src="https://i.imgur.com/azr1IRg.png" title="source: imgur.com" /></a>

body에 클라이언트에서 보내야할 형식으로 json을 보낸다.  
<a href="https://imgur.com/Wg6eSRt"><img src="https://i.imgur.com/Wg6eSRt.png" title="source: imgur.com" /></a>  

성공적으로 데이터가 추가됐다.  

## 패스워드 확인  

틀린패스워드 보냈을 때
<a href="https://imgur.com/TmaKhCV"><img src="https://i.imgur.com/TmaKhCV.png" title="source: imgur.com" /></a>

<a href="https://imgur.com/6L0p0UG"><img src="https://i.imgur.com/6L0p0UG.png" title="source: imgur.com" /></a>

옳바른 패스워드를 보냈을 때
<a href="https://imgur.com/d5OznLn"><img src="https://i.imgur.com/d5OznLn.png" title="source: imgur.com" /></a>

<a href="https://imgur.com/AXHCFlE"><img src="https://i.imgur.com/AXHCFlE.png" title="source: imgur.com" /></a>  

옳바른 패스워드를 보낸다면 정상적으로 응답이 수행된다.  

## 수정 method: put, url : '/modify'

우선 원활한 테스트를 위해 몇개 post해봤다.
<a href="https://imgur.com/P2678ha"><img src="https://i.imgur.com/P2678ha.png" title="source: imgur.com" /></a>  

  
id가 1인 데이터를 수정할거다.  
<a href="https://imgur.com/WzJO8yf"><img src="https://i.imgur.com/WzJO8yf.png" title="source: imgur.com" /></a>  

put요청을 보냈다. 요청은 성공했고 결과도 바르게올까?  
<a href="https://imgur.com/qK6SQp1"><img src="https://i.imgur.com/qK6SQp1.png" title="source: imgur.com" /></a>  

정상적으로 요청이 완료되고 데이터도 바뀐걸 볼 수 있다.  

## 삭제 method: delete, url: '/delete'

id가 1인 데이터를 삭제할거다.
<a href="https://imgur.com/KhcWWf4"><img src="https://i.imgur.com/KhcWWf4.png" title="source: imgur.com" /></a> 

위에서 설명했듯 삭제요청에는 내용이 id하나뿐이다.  
<a href="https://imgur.com/ml6mla0"><img src="https://i.imgur.com/ml6mla0.png" title="source: imgur.com" /></a>

요청한 데이터의 삭제까지 완료됐다.
