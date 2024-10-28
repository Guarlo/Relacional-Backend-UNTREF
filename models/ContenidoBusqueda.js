const { DataTypes } = require('sequelize')
const sequelize = require('../conexion/database')
const Contenido = require('./Contenido')
const Busqueda = require('./Busqueda')

const ContenidoBusqueda = sequelize.define('ContenidoBusqueda', {
    contenido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Contenido,
            key: 'id'
        },
        primaryKey: true
    },
    busqueda_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Busqueda,
            key: 'id'
        },
        primaryKey: true
    }
}, {
    tableName: 'contenido_busquedas',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
})

module.exports = ContenidoBusqueda