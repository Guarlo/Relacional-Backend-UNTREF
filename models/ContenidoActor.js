const { DataTypes } = require('sequelize')
const sequelize = require('../conexion/database')
const Contenido = require('./Contenido')
const Actor = require('./Actor')

const ContenidoActor = sequelize.define('ContenidoActor', {
  contenido_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Contenido,
      key: 'id'
    },
    primaryKey: true
  },
  actor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Actor,
      key: 'id'
    },
    primaryKey: true
  }
}, {
  tableName: 'contenido_actores',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
})

module.exports = ContenidoActor