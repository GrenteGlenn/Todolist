var express = require('express'); // permet l'utilisation d'express
var router = express.Router(); // permet de connecter les routes
const jwt = require('jsonwebtoken')// permet de créer un token
const mysql = require('mysql2/promise');// permet d'utilister mysql en async
const bcrypt = require('bcrypt'); // Hash le mot de passe
const { Router } = require('express');
const { token } = require('morgan');


// permet de se co à la database
function connectionDB() {
  return mysql.createConnection({
    host: '127.0.0.1',
    user: 'kinsuful',
    password: '12345',
    database: 'API',
  });
}
var db;

const SECRET = 'moby' // mot secret pour decoder le token


//////////////////////////////////// vérification du token ////////////////////////////////////
const verifyToken = (req, res, next) => {

  const Token = req.headers.authorization

  if (!Token) {
    return res.status(401).json({ message: 'Need TOKEN !' })
  }

  jwt.verify(Token, SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: 'Error. Bad token' })
    } else {
      return next()
    }
  })
}

////////////////////////////// me ///////////////////////////////////////
router.get('/me', verifyToken, (req, res) => {

  const Token = req.headers.authorization
  const decoded = jwt.decode(Token, { complete: false })
  
  return res.json( decoded )

})


//////////////////////////////////// récupère les infos de l'utilisateur ////////////////////////////////////
router.get('/:UserID', verifyToken, async (req, res) =>{

  db = await connectionDB()
  const [result] = await db.query(`SELECT username FROM users WHERE UserID = ${req.params.UserID}`)
  return res.status(200).json(result)
})

////////////////////////////// Modification user ///////////////////////////////////////
router.put('/:UserID', verifyToken, async (req, res) => {
  if (!req.body.username || !req.body.password ) {
    return res.status(400).json({ message: 'Error. Please enter username' })
  }
  const Token = req.headers.authorization
  const decoded = jwt.decode(Token, { complete: false })
  
  if(req.params.UserID != decoded.UserID)
  return res.status(403).json({ message: 'Error. forbbiden'})

  db = await connectionDB()

  {
    const [result] = await db.query(`SELECT username FROM users WHERE username = '${req.body.username}' && UserID != ${decoded.UserID} `)
    if (typeof result[0] !== 'undefined') {
      return res.status(400).json({ message: `User '${req.body.username}' already exist` })
    }
  }

  var salt = await bcrypt.genSalt(10)
  passwordHash = await bcrypt.hash(req.body.password, salt)
  const [result] = await db.query(`UPDATE users SET username = '${req.body.username}', password = '${passwordHash}' WHERE UserID = ${decoded.UserID}`)
  console.log(result)
  return res.json(result)
})


////////////////////////////// Delete user ///////////////////////////////////////
router.delete('/:UserID', verifyToken, async (req, res) => {

  db = await connectionDB()

  const [result] = await db.query(`DELETE FROM users WHERE UserID = ${req.params.UserID} `)
  console.log(result)
  return res.status(201).json({ message: `Account : '${req.params.UserID}'  was suppressed` })

})


module.exports = { router, connectionDB, verifyToken }

