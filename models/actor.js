/// Importamos sequelize y la instancia de conexión
const { DataTypes } = require('sequelize')
const sequelize = require('../conexion/database') // Ajusta la ruta según tu archivo de conexión

// Definimos el modelo 'Actor'
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
  tableName: 'actores',   // Opcional: define explícitamente el nombre de la tabla si difiere del modelo
  timestamps: false        // Deshabilita createdAt y updatedAt si no están en la tabla
})

module.exports = Actor