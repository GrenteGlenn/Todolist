/*
new Promise((resolve, rejects)=> {
    db.query("SELECT * FROM users WHERE username = ?"[req.body.username] ,function(error, result){
        if(error){
            rejects(error)
        }
        resolve(result)
    }) 
  })
  .then(result => {
    res.status(400).json({ message: `this user already exist`})
  })
  .catch(error =>{
    db.query(`INSERT INTO users (username, password, role, email, adresse) VALUES ('${req.body.username}', '${req.body.password}', 'user', '${req.body.email}', '${req.body.adresse}') ON DUPLICATE KEY UPDATE id=id`)
    res.status(201).json({ message: `User created`})
  })

  */

//   var express = require('express');
//   var router = express.Router();
//   const jwt = require('jsonwebtoken')
//   const mysql = require('mysql2/promise');
//   const register = require('../function')
//   const bcrypt = require('bcrypt');
//   const { Router } = require('express');
//   var db
//   async function connectdb(){
//   const db = await mysql.createConnection({
//     host: '127.0.0.1',
//     user: 'kinsuful',
//     password: '12345',
//     database: 'API',
//   });
//   }
//   connectdb()
  
//   const SECRET ='moby'
  
//   /* GET users listing. */
//   router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
//   });
  
//   router.get('/test', function(req, res){
//     res.send('hello world');
//   })
  
//   router.post('/register',async (req,res) => {
//     if (!req.body.username || !req.body.password || !req.body.email || !req.body.adresse) {
//       return res.status(400).json({ message: 'Error. Please enter username and password' })
//     }
//     const salt = await bcrypt.genSalt(10)
//     req.body.password = await bcrypt.hash(req.body.password, salt)
  
  
//     try{
//       await db.query(`INSERT INTO users (username, password, role, email, adresse) VALUES ('${req.body.username}', '${req.body.password}', 'user', '${req.body.email}', '${req.body.adresse}')ON DUPLICATE KEY UPDATE id = id`)
//     }catch(error){
//       console.log(error)
//       return res.status(201).json({ message: `User '${req.body.username}' already exist`})
//     }
//     return res.status(201).json({ message: `User created`})
//   })
  