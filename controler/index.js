const {post} = require("../models");
const jwt = require("jsonwebtoken");

module.exports = {
  get: async (req, res)=>{
    /* attributes를 설정해준 이유는 
    절대로 클라이언트는 비밀번호같은 개인정보를 받아선 안된다.
    또한 다른데이터는 굳이 쓸 일이 없어서다
    select name,comment from posts와 똑같다 */
    console.log(req.cookies)
    const result = await post.findAll({
      attributes: ['id', 'name', 'comment']
    });
    res.send(result);
  },
  write: async (req, res)=>{
    //body를 구조분해 할당한다.
    const {name, password, comment} = req.body;
    //posts테이블에 요청받은 body를 기준으로 새로운데이터를 생성한다.
    await post.create({
      name,
      password,
      comment
    });
    res.status(201).send('ok');
  },
  //수정 삭제에서 비밀번호 확인
  postPw: async (req, res)=>{
    const {id, password} = req.body;
    const result = await post.findOne({
      //비밀번호검증을 한번 거쳤기때문에 패스워드를 던져줘도 괜찮
      attributes:['id','name','password','comment'],
      where:{
        id,password
      }
    })
    if(result){
      res.cookie().status(200).send(result);
    }else{
      res.status(400).send('invalid');
    }
  },
  //수정
  modify: async (req, res)=>{
    const {name, password, comment} = req.body;
    console.log(req.headers)
    jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.ACCESS_SECRET,
      async (err, result)=>{
        if(err){
          res.status(400).end();
        }else{
            await post.update({
              name,password,comment
            },{
              where:{
                id:result.id
              }
            })
            res.status(201).end();
          }
        }
    )
  },
  //삭제작업은 신중하기에 password를 한번 더 확인하는걸 추천
  delete: async (req, res)=>{
    console.log(req.headers)
    console.log(req.body)
    res.send('삭제완료')
  },
}