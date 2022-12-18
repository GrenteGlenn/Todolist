var express = require('express');
var router = express.Router();
const users = require('./users'); // import le fichier users
const bcrypt = require('bcrypt'); // Hash le mot de passe
users.connectionDB() // import connection à la DB


////////////////////////////// Register ///////////////////////////////////////
router.post('/',async (req,res) => {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ message: 'Error. Please enter username and password' })
    }
    db = await users.connectionDB()
    const [result] = await db.query(`SELECT username FROM users WHERE username = '${req.body.username}'`)
    if(typeof result[0] !== 'undefined'){
    return res.status(400).json({ message: `User '${req.body.username}' already exist`})
    }
    else{
      var salt = await bcrypt.genSalt(10)
      passwordHash = await bcrypt.hash(req.body.password, salt)
      db.query(`INSERT INTO users (username, password) VALUES ('${req.body.username}', '${passwordHash}')`)
      return res.status(201).json({ message: `User created`})
    }
})

module.exports = router;