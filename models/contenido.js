// Model for Contenido
const { DataTypes } = require('sequelize')
const sequelize = require('../conexion/database')

const Contenido = sequelize.define('Contenido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    poster: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    categoria_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'categorias',
            key: 'id'
        }
    },
    resumen: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    temporadas: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    trailer: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'contenido',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
})

module.exports = Contenido