var express = require('express'); // permet l'utilisation d'express
var router = express.Router(); // permet de connecter les routes
const jwt = require('jsonwebtoken')// permet de créer un token
const mysql = require('mysql2/promise');// permet d'utilister mysql en async
const bcrypt = require('bcrypt'); // Hash le mot de passe
const { Router } = require('express');


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
////////////////////////////// recupération des info de l'user ///////////////////////////////////////
router.get('/users', async (req, res) => {

  db = await connectionDB()
  const [result] = await db.query("SELECT UserID, username, email, adresse FROM users")
  return res.json(result)
})

////////////////////////////// Modification user ///////////////////////////////////////
router.put('/:UserID', verifyToken, async (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.email || !req.body.adresse) {
    return res.status(400).json({ message: 'Error. Please enter username, password, email and adresse' })
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
  const [result] = await db.query(`UPDATE users SET username = '${req.body.username}', password = '${passwordHash}', email = '${req.body.email}', adresse = '${req.body.adresse}'  WHERE UserID = ${decoded.UserID}`)
  console.log(result)
  return res.json(result)
})
////////////////////////////// récupération des information d'un user ///////////////////////////////////////
router.get('/:UserID', async (req, res) => {

  db = await connectionDB()
  const [result] = await db.query(`SELECT UserID, username, email, adresse FROM users WHERE UserID = ${req.params.UserID}`)
  return res.json(result)
})


////////////////////////////// Delete user ///////////////////////////////////////
router.delete('/:UserID', verifyToken, async (req, res) => {

  const Token = req.headers.authorization
  const decoded = jwt.decode(Token, { complete: false })

  db = await connectionDB()

  const [result] = await db.query(`DELETE FROM users WHERE UserID = ${req.params.UserID} `)
  console.log(result)
  return res.status(201).json({ message: `Account : '${req.params.UserID}'  was suppressed` })

})

//////////////////////////////////// récupère tous les produits existants concernant un utilisateur ////////////////////////////////////
router.get(':UserID/products', async (req, res) =>{

  db = await users.connectionDB()
  const [result] = await db.query(`SELECT * FROM products WHERE UserID = ${req.params.UserID}`)
  return res.json(result)
})

module.exports = { router, connectionDB, verifyToken }

