var express = require('express');
var task = express.Router();
const users = require('./users'); // import le fichier users
const jwt = require('jsonwebtoken'); // permet d'utiliser le token
users.connectionDB() // import connection à la DB


//////////////////////////////////// create task////////////////////////////////////
task.post('/create', users.verifyToken, async (req, res) =>{
    if (!req.body.name) {
        return res.status(400).json({ message: 'Error. Please enter name' })
    }

    const Token = req.headers.authorization
    const decoded = jwt.decode(Token,{ complete: false})
    db = await users.connectionDB()
    
    db.query(`INSERT INTO task (name, UserID) VALUES ('${req.body.name}','${decoded.UserID}')`)
 
    return res.status(201).json({ message: `task created`})
    

})
//////////////////////////////////// récupère toutes les taches existante ////////////////////////////////////
task.get('/', async (req, res) =>{

    db = await users.connectionDB()
    const [result] = await db.query("SELECT name, UserID FROM task")
    return res.status(200).json(result)
})




//////////////////////////////////// Modifie les taches ////////////////////////////////////
task.put('/:id',users.verifyToken, async (req, res) =>{
if (!req.body.name) {
    return res.status(400).json({ message: 'Error. Please enter name' })
}
    const Token = req.headers.authorization
    const decoded = jwt.decode(Token,{ complete: false})

    db = await users.connectionDB()
    
    const [total] = await db.query(`SELECT UserID FROM task WHERE id = ${req.params.id}`) // vérifie si l'id correspond à l'UserID
    if(decoded.UserID !== total[0].UserID){
        return res.status(403).json({ message: 'forbidden'})
    }
    await db.query(`UPDATE task SET name = '${req.body.name}' WHERE id = ${req.params.id}`)
    return res.status(201).json({ message: 'Modification effectuée'})
})

//////////////////////////////////// supprime les taches////////////////////////////////////
task.delete('/:id', users.verifyToken, async (req, res) =>{
 
    const Token = req.headers.authorization
    const decoded = jwt.decode(Token,{ complete: false})
  
    db = await users.connectionDB()

    const [total] = await db.query(`SELECT UserID FROM task WHERE id = ${req.params.id}`)
    if(decoded.UserID !== total[0].UserID){
        return res.status(403).json({ message: 'forbidden'})
    }
  
    await db.query(`DELETE id,name FROM task WHERE id = ${req.params.id} `)
    
    return res.status(200).json({ message: `task: '${req.params.id}'  was suppressed`})
})


module.exports = task;

