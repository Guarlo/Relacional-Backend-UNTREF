const { DataTypes } = require('sequelize')
const sequelize = require('../conexion/database')
const Contenido = require('./Contenido') 
const Genero = require('./Genero')

const ContenidoGenero = sequelize.define('ContenidoGenero', {
  contenido_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Contenido,
      key: 'id'
    },
    primaryKey: true
  },
  genero_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Genero,
      key: 'id'
    },
    primaryKey: true
  }
}, {
  tableName: 'contenido_generos',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
})

module.exports = ContenidoGenero