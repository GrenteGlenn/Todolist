var express = require('express');
var product = express.Router();
const users = require('./users'); // import le fichier users
const jwt = require('jsonwebtoken'); // permet d'utiliser le token
users.connectionDB() // import connection à la DB


//////////////////////////////////// creation d'un produit et l'associe au client co ////////////////////////////////////
product.post('/create', users.verifyToken, async (req, res) =>{
    if (!req.body.name || !req.body.price|| !req.body.link  || !req.body.currency || !req.body.description ) {
        return res.status(400).json({ message: 'Error. Please enter name, price and UserID' })
    }

    const Token = req.headers.authorization
    const decoded = jwt.decode(Token,{ complete: false})
    db = await users.connectionDB()
    
    db.query(`INSERT INTO products (name, price, description, currency, link, UserID) VALUES ('${req.body.name}', '${req.body.price}', '${req.body.description}','${req.body.currency}', '${req.body.link}', '${decoded.UserID}')`)
    // catch error
    return res.status(201).json({ message: `product created`})
    


})

////////////////////////////////////  récupère les infos d'un produits d'un user ////////////////////////////////////
product.get('/:id', async (req , res) =>{

    db = await users.connectionDB()
    const [result] = await db.query(`SELECT name, price FROM products WHERE UserID = '${req.params.id}'`)
    return res.json(result)

})

//////////////////////////////////// Modifie les infos d'un produit ////////////////////////////////////
product.put('/:id',users.verifyToken, async (req, res) =>{
if (!req.body.name || !req.body.price) {
    return res.status(400).json({ message: 'Error. Please enter name, price' })
}
    const Token = req.headers.authorization
    const decoded = jwt.decode(Token,{ complete: false})

    db = await users.connectionDB()
    
    const [total] = await db.query(`SELECT UserID FROM products WHERE id = ${req.params.id}`) // vérifie si l'id correspond à l'UserID
    if(decoded.UserID !== total[0].UserID){
        return res.status(403).json({ message: 'forbidden'})
    }
    await db.query(`UPDATE products SET name = '${req.body.name}', price = '${req.body.price}' WHERE id = ${req.params.id}`)
    return res.status(201).json({ message: 'Modification effectuée'})
})

//////////////////////////////////// supprime les infos d'un produits ////////////////////////////////////
product.delete('/:id', users.verifyToken, async (req, res) =>{
 
    const Token = req.headers.authorization
    const decoded = jwt.decode(Token,{ complete: false})
  
    db = await users.connectionDB()

    const [total] = await db.query(`SELECT UserID FROM products WHERE id = ${req.params.id}`)
    if(decoded.UserID !== total[0].UserID){
        return res.status(403).json({ message: 'forbidden'})
    }
  
    await db.query(`DELETE FROM products WHERE id = ${req.params.id} `)
    
    return res.status(200).json({ message: `product  : '${req.params.id}'  was suppressed`})
})

//////////////////////////////////// récupère tous les produits existant ////////////////////////////////////
product.get('/', async (req, res) =>{

    db = await users.connectionDB()
    const [result] = await db.query("SELECT name, price, description, currency, link, UserID FROM products")
    return res.status(200).json(result)
})


module.exports = product;

