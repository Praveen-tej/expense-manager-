const mysql = require("mysql2");

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"tej@2004",
    database:"expense_manager"
})

connection.connect((err) => {
    if(err){
        console.log("Dtabase connection failed:",err.message)
        return;
    }
    console.log("Database connected successfully")
})

module.exports = connection;