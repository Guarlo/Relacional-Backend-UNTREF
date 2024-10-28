// Model for Categoria
const { DataTypes } = require('sequelize')
const sequelize = require('../conexion/database')

const Categoria = sequelize.define('Categoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  }
}, {
  tableName: 'categorias',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
})

module.exports = Categoria