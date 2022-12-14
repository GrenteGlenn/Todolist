const mysql = require('mysql');
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'kinsuful',
    password: '12345',
    database: 'API'
});

//Connection à la db
db.connect(function(err) {
    if(err) {
        console.error('Impossible de se connecter', err)
    }
    console.log('Connecté à la db');
    
});