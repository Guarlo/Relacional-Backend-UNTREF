// Model for Genero
const { DataTypes } = require('sequelize')
const sequelize = require('../conexion/database')

const Genero = sequelize.define('Genero', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    }
}, {
    tableName: 'generos',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
})

module.exports = Genero