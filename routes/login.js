var express = require('express');
var router = express.Router();
const users = require('./users'); // import le fichier users
const bcrypt = require('bcrypt'); // Hash le mot de passe
const jwt = require('jsonwebtoken')// permet de créer un token
users.connectionDB() // import connection à la DB


const SECRET ='moby' // mot secret pour decoder le token

router.post('/',async(req, res) => {
 
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Error. Please enter the correct username and password' })
    }
    db = await users.connectionDB()
    const [result] = await db.query(`SELECT UserID, username, password, email, role, adresse FROM users WHERE username = '${req.body.username}'`)
    if (result.length === 0)
      {
        return res.status(401).json({message:'no user'});
      }
      const match = await bcrypt.compare(req.body.password,result[0].password)
        if(!match) {
        
          return res.status(401).json({error: 'Incorrect password !'})
        }
         
      const token = jwt.sign ({
        UserID: result[0].UserID,
        username: result[0].username,
        email: result[0].email,
        adresse: result[0].adresse,
        role: result[0].role
        
      },SECRET, { expiresIn: '8 hours' })
      return res.json({access_token: token})
  })


  module.exports = router;