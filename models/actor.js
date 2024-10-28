// Definimos el modelo 'Actor'
const { DataTypes } = require('sequelize')
const sequelize = require('../conexion/database')

const Actor = sequelize.define('Actor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  }
}, {
  tableName: 'actores',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
})

module.exports = Actor