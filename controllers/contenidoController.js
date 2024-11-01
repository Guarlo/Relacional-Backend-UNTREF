const Joi = require('joi')
const { sequelize, Contenido, Categoria, Actor, Genero, Busqueda, ContenidoActor, ContenidoBusqueda, ContenidoGenero } = require('../models')

const contenidoSchemaPost = Joi.object({
  id: Joi.number().integer(),
  poster: Joi.string().max(255).allow(null, '').optional(),
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

const contenidoSchemaPut = Joi.object({
  id: Joi.number().integer().required(),
  poster: Joi.string().max(255).allow(null, '').optional(),
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

const contenidoSchemaPatch = Joi.object({
  id: Joi.number().integer().required(), // Se mantiene como requerido para identificar el contenido
  poster: Joi.string().max(255).allow(null, '').optional(), // Opcional, permite null y cadena vacía
  titulo: Joi.string().max(255).optional(),
  categoria_id: Joi.alternatives().try(Joi.number().integer(), Joi.string()).optional(),
  resumen: Joi.string().allow(null).optional(),
  temporadas: Joi.number().integer().allow(null).optional(),
  duracion: Joi.number().integer().allow(null).optional(),
  trailer: Joi.string().max(255).allow(null).optional(),
  genero: Joi.array().items(Joi.alternatives().try(Joi.number().strict(), Joi.string().strict())).optional(),
  busqueda: Joi.array().items(Joi.alternatives().try(Joi.number().strict(), Joi.string().strict())).optional(),
  reparto: Joi.array().items(Joi.alternatives().try(Joi.number().strict(), Joi.string().strict())).optional()
})


// Función para buscar o crear ID en la tabla correspondiente
const findOrCreateIds = async (array, Model, field) => {
  const ids = await Promise.all(array.map(async (value) => {
    if (typeof value === 'number') {
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

// Obtener todos los contenidos. Opcinalmente con filtros.
const getAllContenido = async (req, res) => {
  const { genero, busqueda, reparto, categoria } = req.query

  try {
    const where = {}
    // Agregar filtro de categoría si se proporciona. Solo como ejemplo, categoria ya está en include = []
    //if (categoria) {
    //  where.categoria_id = categoria
    // }

    // Configurar los filtros para relaciones many-to-many
    const include = [
      categoria ? { model: Categoria, as: 'categoria', where: { id: categoria }, attributes: ['nombre'] } : { model: Categoria, as: 'categoria', attributes: ['nombre'] },
      genero ? { model: Genero, as: 'genero', where: { nombre: genero }, attributes: ['nombre'] } : { model: Genero, as: 'genero', attributes: ['nombre'] },
      busqueda ? { model: Busqueda, as: 'busqueda', where: { termino: busqueda }, attributes: ['termino'] } : { model: Busqueda, as: 'busqueda', attributes: ['termino'] },
      reparto ? { model: Actor, as: 'reparto', where: { nombre: reparto }, attributes: ['nombre'] } : { model: Actor, as: 'reparto', attributes: ['nombre'] }
    ]

    // Consultar los contenidos con los filtros aplicados
    const contenidos = await Contenido.findAll({
      where,
      include
    })

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
    const contenido = await Contenido.findByPk(id, {
    })
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

    // Convertir a objeto JSON para permitir agregar propiedades
    const contenidoData = contenido.toJSON()
    // Transformar los resultados a arreglos de IDs y agregarlos a contenidoData
    contenidoData.generoIds = generoIds.map(g => g.genero_id)
    contenidoData.busquedaIds = busquedaIds.map(b => b.busqueda_id)
    contenidoData.repartoIds = repartoIds.map(r => r.actor_id)

    // Enviar el objeto JSON con los nuevos campos al cliente
    res.status(200).json(contenidoData)

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el contenido' })
  }
}

// Obtener un contenidos por ID con validación de ID y sus datos relacinados completos.
const getByIdContenidoFull = async (req, res) => {
  const { id } = req.params

  if (!Number.isInteger(Number(id)) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' })
  }

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
    if (!contenido) {
      return res.status(404).json({ error: 'Contenido no encontrado' })
    }
    res.status(201).json(contenido)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el contenido y sus relaciones', error })
  }
}

// Obtener un actor por ID con validación de ID y sus contenidos.
const getContenidoByIdActor = async (req, res) => {
  const { id } = req.params

  if (!Number.isInteger(Number(id)) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  try {
    const actor = await Actor.findByPk(id,
      {
        include: {
          model: Contenido
        }
      }
    )
    res.status(201).json(actor)
  } catch (error) {
    res.status(500).send({ error: 'No se pudo encontrar el contenidos para el actor' })
  }
}

// Crear un nuevo contenido con validación de datos y relaciones
const createContenido = async (req, res) => {
  // Validación de los datos de entrada
  const { error, value } = contenidoSchemaPost.validate(req.body)
  if (error) {
    return res.status(400).json({ error: 'Datos inválidos', details: error.details.map(e => e.message).join(", ") })
  }

  let { genero, busqueda, reparto, categoria_id, id, ...data } = value

  // Si no se proporciona el ID, buscar un ID libre en la tabla Contenido
  if (!id) {
    const maxId = await Contenido.max('id')
    id = maxId ? maxId + 1 : 1
  }

  try {
    // Verificar si ya existe un contenido con el mismo ID
    const existingContenido = await Contenido.findByPk(id)
    if (existingContenido) {
      return res.status(409).json({
        message: "El registro ya existe. No se puede duplicar en la base de datos.",
        record: existingContenido
      })
    }

    // Obtener los IDs de relaciones y categoría
    const generoIds = await findOrCreateIds(genero, Genero, 'nombre')
    const busquedaIds = await findOrCreateIds(busqueda, Busqueda, 'termino')
    const repartoIds = await findOrCreateIds(reparto, Actor, 'nombre')
    const categoriaIds = await findIds([categoria_id], Categoria, 'nombre')

    if (!categoriaIds.length) {
      return res.status(400).json({ error: 'Categoría no encontrada o inválida' })
    }

    const contenido = await sequelize.transaction(async (t) => {
      const newContenido = await Contenido.create(
        { ...data, id, categoria_id: categoriaIds[0] },
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

// Actualizar un contenido existente con validación de datos y relaciones
const updateContenido = async (req, res) => {
  // Validación de los datos de entrada
  const { id } = req.params  // ID del contenido a actualizar desde la URL
  const { error, value } = contenidoSchemaPut.validate(req.body)
  if (error) {
    return res.status(400).json({ error: 'Datos inválidos', details: error.details.map(e => e.message).join(", ") })
  }

  const { genero, busqueda, reparto, categoria_id, ...data } = value
  const contenidoId = data.id

  // Si el id de la URL  req.params no es = al id de req.body devuelve error
  if (Number(id) !== Number(contenidoId)) {
    return res.status(400).json({ error: 'Datos inválidos. req.params.id y req.body.id no son iguales!' })
  }

  try {
    // Buscar el contenido existente por ID
    const contenido = await Contenido.findByPk(contenidoId)
    if (!contenido) {
      return res.status(404).json({ error: 'Contenido no encontrado' })
    }

    // Obtener los IDs de relaciones y categoría
    const generoIds = await findOrCreateIds(genero, Genero, 'nombre')
    const busquedaIds = await findOrCreateIds(busqueda, Busqueda, 'termino')
    const repartoIds = await findOrCreateIds(reparto, Actor, 'nombre')
    const categoriaIds = await findIds([categoria_id], Categoria, 'nombre')

    if (!categoriaIds.length) {
      return res.status(400).json({ error: 'Categoría no encontrada o inválida' })
    }

    // Actualizar el contenido y sus relaciones dentro de una transacción
    await sequelize.transaction(async (t) => {
      // Actualizar los datos principales de contenido
      await contenido.update({ ...data, categoria_id: categoriaIds[0] }, { transaction: t })

      // Actualizar relaciones many-to-many
      await contenido.setGenero(generoIds, { transaction: t })
      await contenido.setBusqueda(busquedaIds, { transaction: t })
      await contenido.setReparto(repartoIds, { transaction: t })
    })

    // Retornar el contenido actualizado
    res.status(200).json({ message: 'Contenido actualizado correctamente', contenido })

  } catch (error) {
    const statusCode = error.name === 'SequelizeValidationError' ? 400 : 500
    res.status(statusCode).json({ error: 'Error al actualizar el contenido', details: error.message })
  }
}

// Actualizar parcialmente un contenido existente con validación de datos y relaciones
const patchContenido = async (req, res) => {
  // Validación de los datos de entrada
  const { id } = req.params // ID del contenido a actualizar desde la URL
  const { error, value } = contenidoSchemaPatch.validate(req.body, { abortEarly: false }) // Se valida solo los datos proporcionados
  if (error) {
    return res.status(400).json({ error: 'Datos inválidos', details: error.details.map(e => e.message).join(", ") })
  }
  const { genero, busqueda, reparto, categoria_id, ...data } = req.body // Solo toma los datos que se pasan en la solicitud
  const contenidoId = data.id

  // Si el id de la URL  req.params no es = al id de req.body devuelve error
  if (Number(id) !== Number(contenidoId)) {
    return res.status(400).json({ error: 'Datos inválidos. req.params.id y req.body.id no son iguales!' })
  }

  try {
    // Buscar el contenido existente por ID
    const contenido = await Contenido.findByPk(id)
    if (!contenido) {
      return res.status(404).json({ error: 'Contenido no encontrado' })
    }

    // Verificar si hay cambios en la categoría y obtener el ID si es necesario
    let categoriaIds = []
    if (categoria_id) {
      categoriaIds = await findIds([categoria_id], Categoria, 'nombre')
      if (!categoriaIds.length) {
        return res.status(400).json({ error: 'Categoría no encontrada o inválida' })
      }
    }

    // Actualizar el contenido y sus relaciones dentro de una transacción
    await sequelize.transaction(async (t) => {
      // Actualizar solo los datos que se han proporcionado
      await contenido.update({ ...data, categoria_id: categoriaIds[0] || contenido.categoria_id }, { transaction: t })

      // Actualizar relaciones many-to-many solo si se han proporcionado
      if (genero) {
        const generoIds = await findOrCreateIds(genero, Genero, 'nombre')
        await contenido.setGenero(generoIds, { transaction: t })
      }

      if (busqueda) {
        const busquedaIds = await findOrCreateIds(busqueda, Busqueda, 'termino')
        await contenido.setBusqueda(busquedaIds, { transaction: t })
      }

      if (reparto) {
        const repartoIds = await findOrCreateIds(reparto, Actor, 'nombre')
        await contenido.setReparto(repartoIds, { transaction: t })
      }
    })

    // Retornar el contenido actualizado
    res.status(200).json({ message: 'Contenido actualizado correctamente', contenido })

  } catch (error) {
    const statusCode = error.name === 'SequelizeValidationError' ? 400 : 500
    res.status(statusCode).json({ error: 'Error al actualizar el contenido', details: error.message })
  }
}

// Elimina  un contenido existente con validación de datos y relaciones
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
      // ó
      // res.status(204).send() // Sin contenido
    } else {
      res.status(404).json({ error: 'Contenido no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el contenido' })
  }
}

module.exports = {
  getAllContenido,
  getByIdContenido,
  getByIdContenidoFull,
  getContenidoByIdActor,
  createContenido,
  updateContenido,
  patchContenido,
  deleteContenido
}