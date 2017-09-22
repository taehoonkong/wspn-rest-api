require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt') 
const query = require('./query')

const app = express()

app.use(bodyParser.json())

const jwtMiddleware = expressJwt({secret: process.env.SESSION_SECRET})

app.get('/user', jwtMiddleware, (req, res) => {
  query.getUserById(req.user.id)
    .then(user => {
      res.send({
        username: user.username
      })
    })
})

app.post('/user', (req, res) => {
  // 사용자 생성
  // req.body.username, req.body.password
  const {username, password} = req.body
  console.log(username, password)
  query.createUser(username, password)
    .then(([id]) => {
      // JWT 발행
      const token = jwt.sign({id}, process.env.SESSION_SECRET) 
      // 반환
      res.send({
        token
      })
    })
})

app.post('/login', (req, res) => {
  const{username, password} = req.body
  console.log(username, password)
  query.compareUser(username, password)
    .then(user => {
      // JWT 발행
      const token = jwt.sign({id:user.id}, process.env.SESSION_SECRET)
      // 반환
      res.send({
        token
      })
    })
    .catch(err => {
      console.log(err)
      res.status(404)
      res.send('login failed')
    })
})

app.use(function (err, req, res, next) {
  if(err.name === 'UnauthorizedError') {
    res.status(401).send({
      error: err.name,
      message: err.message
    })
  }
})

app.listen(process.env.PORT, () => {
  console.log(`http://127.0.0.1:${process.env.PORT}`)
})
