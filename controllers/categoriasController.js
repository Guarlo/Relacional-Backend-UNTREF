const Joi = require('joi')
const Categoria = require('../models/Categoria')

// Esquema de validación para la tabla categorías
const categoriaSchema = Joi.object({
  nombre: Joi.string().max(50).required()
})

// Obtener todas las categorías
const getAllCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll()
    res.status(200).json(categorias)
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener las categorías' })
  }
}

// Obtener una categoría por ID con validación de ID
const getByIdCategoria = async (req, res) => {
  const { id } = req.params

  if (!Number.isInteger(Number(id)) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  try {
    const categoria = await Categoria.findByPk(id)
    if (categoria) {
      res.status(200).json(categoria)
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría' })
  }
}

// Crear una nueva categoría con validación de datos
const createCategoria = async (req, res) => {
  const { error } = categoriaSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: 'Datos inválidos', details: error.details })
  }

  try {
    const newCategoria = await Categoria.create(req.body)
    res.status(201).json(newCategoria)
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la categoría' })
  }
}

// Actualizar completamente una categoría por ID
const updateCategoria = async (req, res) => {
  const { id } = req.params
  if (!Number.isInteger(Number(id)) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  const { error } = categoriaSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: 'Datos inválidos', details: error.details })
  }

  try {
    const [updatedRows] = await Categoria.update(req.body, { where: { id } })
    if (updatedRows) {
      res.status(200).json({ message: 'Categoría actualizada correctamente' })
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la categoría' })
  }
}

// Actualización parcial de una categoría por ID
const patchCategoria = async (req, res) => {
  const { id } = req.params
  if (!Number.isInteger(Number(id)) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  const { error } = categoriaSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: 'Datos inválidos para la actualización parcial', details: error.details })
  }

  try {
    const [updatedRows] = await Categoria.update(req.body, { where: { id } })
    if (updatedRows) {
      res.status(200).json({ message: 'Categoría actualizada parcialmente' })
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la categoría' })
  }
}

// Eliminar una categoría por ID
const deleteCategoria = async (req, res) => {
  const { id } = req.params
  if (!Number.isInteger(Number(id)) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  try {
    const deletedRows = await Categoria.destroy({ where: { id } })
    if (deletedRows) {
      res.status(200).json({ message: 'Categoría eliminada correctamente' })
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' })
  }
}

module.exports = {
  getAllCategorias,
  getByIdCategoria,
  createCategoria,
  updateCategoria,
  patchCategoria,
  deleteCategoria
}
