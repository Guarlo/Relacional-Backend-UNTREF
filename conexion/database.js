//***************/
// Recibido en el proyecto. NO TRAE sequelize !!!!
//***************/
// const mysql = require('mysql2')
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD
// })
// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database:', err)
//         return;
//     }
//     console.log('Connected to MySQL database')
// })
// module.exports = connection 

const { Sequelize } = require('sequelize')
//process.loadEnvFile()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
})

module.exports = sequelize