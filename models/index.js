const sequelize = require('../conexion/database')
const Genero = require('./Genero')
const Actor = require('./Actor')
const Busqueda = require('./Busqueda')
const Categoria = require('./Categoria')
const Contenido = require('./Contenido')
const ContenidoActor = require('./ContenidoActor')
const ContenidoBusqueda = require('./ContenidoBusqueda')
const ContenidoGenero = require('./ContenidoGenero')


// Relaciones
Contenido.belongsTo(Categoria, { as: 'categoria', foreignKey: 'categoria_id' })
Categoria.hasMany(Contenido, { foreignKey: 'categoria_id' })

// Relaciones many-to-many
Contenido.belongsToMany(Genero, { through: { model: ContenidoGenero, timestamps: false }, as: 'genero', foreignKey: 'contenido_id', otherKey: 'genero_id' })
Genero.belongsToMany(Contenido, { through: { model: ContenidoGenero, timestamps: false }, foreignKey: 'genero_id', otherKey: 'contenido_id' })

Contenido.belongsToMany(Actor, {  through: { model: ContenidoActor, timestamps: false }, as: 'reparto', foreignKey: 'contenido_id', otherKey: 'actor_id' })
Actor.belongsToMany(Contenido, { through: { model: ContenidoActor, timestamps: false }, foreignKey: 'actor_id', otherKey: 'contenido_id' })

Contenido.belongsToMany(Busqueda, { through: { model: ContenidoBusqueda, timestamps: false }, as: 'busqueda', foreignKey: 'contenido_id', otherKey: 'busqueda_id' })
Busqueda.belongsToMany(Contenido, { through: { model: ContenidoBusqueda, timestamps: false }, foreignKey: 'busqueda_id', otherKey: 'contenido_id' })

// Exportar todos los modelos y sequelize para sincronización
module.exports = { sequelize, Genero, Actor, Busqueda, Categoria, Contenido, ContenidoActor, ContenidoBusqueda, ContenidoGenero }
