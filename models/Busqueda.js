// Definimos el modelo 'Busqueda'
const { DataTypes } = require('sequelize')
const sequelize = require('../conexion/database')

const Busqueda = sequelize.define('Busqueda', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    termino: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    }
}, {
    tableName: 'busquedas',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
})

module.exports = Busqueda