const { Sequelize } = require('sequelize')
// const dotenv = require('dotenv')
// const ENV = process.env.NODE_ENV || 'local'
// dotenv.config({ path: `.env.${ENV}` })

// if (ENV === 'local' || ENV === 'local_guarloweb' || ENV === 'local_railway') {
//   console.log(`.env.${ENV}`)
//   console.log(`host: ${process.env.DB_HOST}`)
// }

console.log(`conecto db host: ${process.env.DB_HOST}`)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  })

module.exports = sequelize