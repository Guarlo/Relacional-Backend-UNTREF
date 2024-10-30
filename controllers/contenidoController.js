const Joi = require('joi')
// const Contenido = require('../models/Contenido')
// const Categoria = require('../models/Categoria.js')
// const Genero = require('../models/Genero.js') // Modelo para la tabla generos
// const Busqueda = require('../models/Busqueda.js') // Modelo para la tabla busquedas
// const Actor = require('../models/Actor.js') // Modelo para la tabla actores
// const sequelize = require('../conexion/database')

// , Categoria
const { sequelize, Contenido, Categoria, Actor, Genero, Busqueda, ContenidoActor, ContenidoBusqueda, ContenidoGenero } = require('../models')


// Esquema de validación para la tabla contenido
// const contenidoSchema = Joi.object({
//   id: Joi.number().integer().required(),
//   poster: Joi.string().max(255).allow(null),
//   titulo: Joi.string().max(255).required(),
//   categoria_id: Joi.number().integer().required(),
//   resumen: Joi.string().allow(null),
//   temporadas: Joi.number().integer().allow(null),
//   duracion: Joi.number().integer().allow(null),
//   trailer: Joi.string().max(255).allow(null),
//   genero: Joi.array().items(Joi.alternatives().try(Joi.number(), Joi.string())).required(),
//   busqueda: Joi.array().items(Joi.alternatives().try(Joi.number(), Joi.string())).required(),
//   reparto: Joi.array().items(Joi.alternatives().try(Joi.number(), Joi.string())).required()
// })
const contenidoSchema = Joi.object({
  id: Joi.number().integer().required(),
  poster: Joi.string().max(255).allow(null),
  titulo: Joi.string().max(255).required(),
  categoria_id: Joi.alternatives().try(Joi.number().integer(), Joi.string()).required(),
  resumen: Joi.string().allow(null),
  temporadas: Joi.number().integer().allow(null),
  duracion: Joi.number().integer().allow(null),
  trailer: Joi.string().max(255).allow(null),
  genero: Joi.array().items(Joi.alternatives().try(Joi.number().strict(), Joi.string().strict())).required(),
  busqueda: Joi.array().items(Joi.alternatives().try(Joi.number().strict(), Joi.string().strict())).required(),
  reparto: Joi.array().items(Joi.alternatives().try(Joi.number().strict(), Joi.string().strict())).required()
})

// Función para buscar o crear ID en la tabla correspondiente
// const findOrCreateIds = async (array, Model, field) => {
//   const ids = []
//   for (const value of array) {
//     if (typeof value === 'number') {
//       const item = await Model.findByPk(value)
//       if (!item) throw new Error(`El ID ${value} no existe en la tabla ${Model.name}`)
//       ids.push(item.id)
//     } else {
//       const item = await Model.findOne({ where: { [field]: value } })
//       if (!item) throw new Error(`El nombre '${value}' no existe en la tabla ${Model.name}`)
//       ids.push(item.id)
//     }
//   }
//   return ids
// }


// const findOrCreateIds = async (array, Model, field) => {
//   const ids = await Promise.all(array.map(async (value) => {
//     if (typeof value === 'number') {
//       const item = await Model.findByPk(value)
//       if (!item) throw new Error(`El ID ${value} no existe en la tabla ${Model.name}`)
//       return item.id
//     } else {
//       const [item] = await Model.findOrCreate({ where: { [field]: value } })
//       return item.id
//     }
//   }))
//   return ids
// }
// // Función para buscar ID en la tabla correspondiente
// const findIds = async (array, Model, field) => {
//   const ids = await Promise.all(array.map(async (value) => {
//     if (typeof value === 'number') {
//       const item = await Model.findByPk(value)
//       if (!item) throw new Error(`El ID ${value} no existe en la tabla ${Model.name}`)
//       return item.id
//     } else {
//       const item = await Model.findOne({ where: { [field]: value } })
//       if (!item) throw new Error(`El nombre '${value}' no existe en la tabla ${Model.name}`)
//       return item.id
//     }
//   }))
//   return ids
// }

// Función para buscar o crear ID en la tabla correspondiente
const findOrCreateIds = async (array, Model, field) => {
  const ids = await Promise.all(array.map(async (value) => {
    if (typeof value === 'number') {
      console.log(value)
      const item = await Model.findByPk(value)
      if (!item) throw new Error(`El ID ${value} no existe en la tabla ${Model.name}`)
      return item.id
    } else {
      const [item] = await Model.findOrCreate({ where: { [field]: value } })
      return item.id
    }
  }))
  return ids
}
// Función para buscar ID en la tabla correspondiente
const findIds = async (array, Model, field) => {
  const ids = await Promise.all(array.map(async (value) => {
    if (typeof value === 'number') {
      const item = await Model.findByPk(value)
      if (!item) throw new Error(`El ID ${value} no existe en la tabla ${Model.name}`)
      return item.id
    } else {
      const item = await Model.findOne({ where: { [field]: value } })
      if (!item) throw new Error(`El nombre '${value}' no existe en la tabla ${Model.name}`)
      return item.id
    }
  }))
  return ids
}

// Obtener todos los contenidos
const getAllContenido = async (req, res) => {
  try {
    const contenidos = await Contenido.findAll()
    res.status(200).json(contenidos)
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener los contenidos' })
  }
}

// Obtener un contenido por ID con validación
const getByIdContenido = async (req, res) => {
  const { id } = req.params
  if (!Number.isInteger(Number(id)) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  try {
    // Obtener el contenido básico
    const contenido = await Contenido.findByPk(id)
    if (!contenido) {
      return res.status(404).json({ error: 'Contenido no encontrado' })
    }

    // Consultas para obtener los IDs relacionados
    const generoIds = await ContenidoGenero.findAll({
      where: { contenido_id: id },
      attributes: ['genero_id']
    })

    const busquedaIds = await ContenidoBusqueda.findAll({
      where: { contenido_id: id },
      attributes: ['busqueda_id']
    })

    const repartoIds = await ContenidoActor.findAll({
      where: { contenido_id: id },
      attributes: ['actor_id']
    })

    // Formatear los resultados en el JSON deseado
    const formattedContenido = {
      id: contenido.id,
      poster: contenido.poster,
      titulo: contenido.titulo,
      categoria_id: contenido.categoria_id,
      genero: generoIds.map(g => g.genero_id),
      busqueda: busquedaIds.map(b => b.busqueda_id),
      resumen: contenido.resumen,
      temporadas: contenido.temporadas,
      duracion: contenido.duracion,
      reparto: repartoIds.map(a => a.actor_id),
      trailer: contenido.trailer
    }

    res.status(200).json(formattedContenido)
  } catch (error) {
    //console.error("Error al obtener el contenido:", error) // Muestra detalles del error en la consola
    res.status(500).json({ error: 'Error al obtener el contenido' })
  }
}

// Obtener un contenidos por ID con validación de ID y sus datos relacinados completos.
/**
 * @swagger
 * /contenido/{contenidoId}/full
 *   get:
 *     summary: Obtener contenido relacionado a un actor específico
 *     description: Endpoint para obtener una lista de contenido relacionada al actor cuyo ID se proporciona.
 *     parameters:
 *       - in: path
 *         name: actorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del actor para buscar el contenido relacionado
 *     responses:
 *       200:
 *         description: Contenidos relacionados al actor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 5
 *                   poster:
 *                     type: string
 *                     example: "./posters/actor-5.jpg"
 *                   titulo:
 *                     type: string
 *                     example: "The Mandalorian"
 *                   categoria:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         example: "Serie"
 *                   genero:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "Sci-Fi"
 *                   busqueda:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "Pedro Pascal"
 *                   resumen:
 *                     type: string
 *                     example: "Serie ambientada en el universo de Star Wars..."
 *                   temporadas:
 *                     type: integer
 *                     example: 2
 *                   duracion:
 *                     type: integer
 *                     example: 45
 *                   reparto:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "Pedro Pascal"
 *                   trailer:
 *                     type: string
 *                     example: "https://www.youtube.com/embed/trailer12345"
 *       400:
 *         description: ID del actor inválido
 *         content:
 *           application/json:
 *             example:
 *               error: ID del actor inválido
 *       404:
 *         description: Actor o contenido no encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: Contenido no encontrado para el actor especificado
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             example:
 *               error: Error al obtener el contenido relacionado al actor
 */
const getByIdContenidoFull = async (req, res) => {
  const { id } = req.params
  try {
    const contenido = await Contenido.findByPk(id,
      {
        include: [
          {
            model: Actor,
            as: 'reparto',
            attributes: ['nombre']
          },
          {
            model: Genero,
            as: 'genero',
            attributes: ['nombre']
          },
          {
            model: Busqueda,
            as: 'busqueda',
            attributes: ['termino']
          },
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['nombre']
          }
        ]
      }
    )
    console.log(contenido)
    res.status(201).json(contenido)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el contenido y sus actores', error })
  }
}

// Crear un nuevo contenido con validación de datos y relaciones
const createContenido = async (req, res) => {
  //console.log(req.body)
  // Validación de los datos de entrada
  const { error, value } = contenidoSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: 'Datos inválidos', details: error.details.map(e => e.message).join(", ") })
  }

  const { genero, busqueda, reparto, categoria_id, ...data } = value
  const contenidoId = data.id

  try {
    // Verificar si ya existe un contenido con el mismo ID
    const existingContenido = await Contenido.findByPk(contenidoId)
    if (existingContenido) {
      return res.status(409).json({
        message: "El registro ya existe. No se puede duplicar en la base de datos.",
        record: existingContenido
      })
    }

    // Obtener los IDs de relaciones y categoría
    const generoIds = await findOrCreateIds(genero, Genero, 'nombre')
    console.log(generoIds)
    const busquedaIds = await findOrCreateIds(busqueda, Busqueda, 'termino')
    console.log(busquedaIds)
    const repartoIds = await findOrCreateIds(reparto, Actor, 'nombre')
    console.log(repartoIds)

    console.log(categoria_id)
    const categoriaIds = await findIds([categoria_id], Categoria, 'nombre')
    console.log(categoriaIds)

    if (!categoriaIds.length) {
      return res.status(400).json({ error: 'Categoría no encontrada o inválida' })
    }

    // Crear el contenido en una transacción
    // console.log(data)
    // const contenido = {}

    const contenido = await sequelize.transaction(async (t) => {
      const newContenido = await Contenido.create(
        { ...data, categoria_id: categoriaIds[0] },
        { transaction: t }
      )
      await newContenido.addReparto(repartoIds, { transaction: t })
      await newContenido.addBusqueda(busquedaIds, { transaction: t })
      await newContenido.addGenero(generoIds, { transaction: t })
      return newContenido
    })

    res.status(201).json(contenido)

  } catch (error) {
    const statusCode = error.name === 'SequelizeValidationError' ? 400 : 500
    res.status(statusCode).json({ error: 'Error al crear el contenido', details: error.message })
  }
}

// const createContenido = async (req, res) => {
//   const { error } = contenidoSchema.validate(req.body)
//   if (error) {
//     return res.status(400).json({ error: 'Datos inválidos', details: error.details })
//   }

//   const { genero, busqueda, reparto, ...contenidoData } = req.body

//   //console.log("Contenido Data:", contenidoData)
//   try {
//     const generoIds = await findOrCreateIds(genero, Genero, 'nombre')
//     const busquedaIds = await findOrCreateIds(busqueda, Busqueda, 'termino')
//     const repartoIds = await findOrCreateIds(reparto, Actor, 'nombre')

//     console.log("Genero IDs:", generoIds)
//     console.log("Busqueda IDs:", busquedaIds)
//     console.log("Reparto IDs:", repartoIds)

//     console.log("Contenido 2 Data:", contenidoData)

//     const contenido = await sequelize.transaction(async (t) => {
//       const newContenido = await Contenido.create(contenidoData, { transaction: t })
//       await newContenido.addActors(repartoIds, { transaction: t })
//       await newContenido.addBusquedas(busquedaIds, { transaction: t })
//       await newContenido.addGeneros(generoIds, { transaction: t })
//       return newContenido
//     })
//     res.status(201).json(contenido)
//   } catch (error) {
//     res.status(400).json({ error: error.message || 'Error al crear el contenido' })
//   }
// }


// Actualizar un contenido completo por ID
const updateContenido = async (req, res) => {
  const { id } = req.params
  const { error } = contenidoSchema.validate(req.body)

  if (error || !Number.isInteger(Number(id)) || id <= 0) {
    return res.status(400).json({ error: 'Datos o ID inválidos', details: error?.details })
  }

  const { genero, busqueda, reparto, ...contenidoData } = req.body

  try {
    const generoIds = await findOrCreateIds(genero, Genero, 'nombre')
    const busquedaIds = await findOrCreateIds(busqueda, Busqueda, 'termino')
    const repartoIds = await findOrCreateIds(reparto, Actor, 'nombre')

    const contenido = await sequelize.transaction(async (t) => {
      const [updated] = await Contenido.update(contenidoData, { where: { id }, transaction: t })
      if (!updated) throw new Error('Contenido no encontrado para actualizar')

      const existingContenido = await Contenido.findByPk(id, { transaction: t })
      await existingContenido.setGeneros(generoIds, { transaction: t })
      await existingContenido.setBusquedas(busquedaIds, { transaction: t })
      await existingContenido.setActores(repartoIds, { transaction: t })

      return existingContenido
    })

    res.status(200).json(contenido)
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error al actualizar el contenido' })
  }
}

const deleteContenido = async (req, res) => {
  const { id } = req.params

  if (!Number.isInteger(Number(id)) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  try {
    // Eliminar registros de las tablas de unión
    await ContenidoActor.destroy({ where: { contenido_id: id } })
    await ContenidoBusqueda.destroy({ where: { contenido_id: id } })
    await ContenidoGenero.destroy({ where: { contenido_id: id } })

    // Eliminar el registro principal
    const deletedRows = await Contenido.destroy({ where: { id } })

    if (deletedRows) {
      res.status(200).json({ message: 'Contenido eliminado correctamente' })
    } else {
      res.status(404).json({ error: 'Contenido no encontrado' })
    }
  } catch (error) {
    console.error('Error al eliminar el contenido:', error)
    res.status(500).json({ error: 'Error al eliminar el contenido' })
  }
}

module.exports = {
  getAllContenido,
  getByIdContenido,
  getByIdContenidoFull,
  createContenido,
  updateContenido,
  deleteContenido
}