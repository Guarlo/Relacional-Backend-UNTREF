const Genero = require('../models/Genero')
const Contenido = require('../models/Contenido')
const Joi = require('joi')

// Esquema de validación para el modelo Genero
const generoSchema = Joi.object({
    nombre: Joi.string().max(100).required()
})

// Obtener todos los géneros
const getAllGeneros = async (req, res) => {
    try {
        const generos = await Genero.findAll()
        res.status(200).json(generos)
    } catch (error) {
        res.status(500).json({ error: 'No se pudieron obtener los géneros' })
    }
}

// Obtener un género por ID con validación
const getByIdGenero = async (req, res) => {
    const { id } = req.params
    if (!Number.isInteger(Number(id)) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido' })
    }

    try {
        const genero = await Genero.findByPk(id)
        if (genero) {
            res.status(200).json(genero)
        } else {
            res.status(404).json({ error: 'Género no encontrado' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el género' })
    }
}

// Crear un nuevo género con validación de datos
const createGenero = async (req, res) => {
    const { error } = generoSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ error: 'Datos inválidos', details: error.details })
    }

    try {
        const genero = await Genero.create(req.body)
        res.status(201).json(genero)
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).json({ error: 'El género ya existe' })
        } else {
            res.status(500).json({ error: 'Error al crear el género' })
        }
    }
}

// Actualizar un género por ID con validación de datos
const updateGenero = async (req, res) => {
    const { id } = req.params
    const { error } = generoSchema.validate(req.body)

    // Validación de datos de entrada
    if (error || !Number.isInteger(Number(id)) || id <= 0) {
        return res.status(400).json({ error: 'Datos o ID inválidos', details: error?.details })
    }

    try {
        // Verificar si el género existe
        const genero = await Genero.findByPk(id)
        if (!genero) {
            return res.status(404).json({ error: 'Género no encontrado' })
        }

        // Verificar si el nombre es el mismo para evitar actualización innecesaria
        if (genero.nombre === req.body.nombre) {
            return res.status(200).json({ message: 'No se realizaron cambios, el nombre es el mismo' })
        }

        // Actualizar el género
        const [updated] = await Genero.update(req.body, { where: { id } })
        if (updated) {
            const updatedGenero = await Genero.findByPk(id)
            res.status(200).json(updatedGenero)
        } else {
            res.status(500).json({ error: 'No se pudo actualizar el género' })
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).json({ error: 'El género ya existe' })
        } else {
            res.status(500).json({ error: 'Error al actualizar el género' })
        }
    }
}

// Eliminar un género por ID
const deleteGenero = async (req, res) => {
    const { id } = req.params

    if (!Number.isInteger(Number(id)) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido' })
    }

    try {
        const deletedRows = await Genero.destroy({ where: { id } })
        if (deletedRows) {
            res.status(200).json({ message: 'Género eliminado correctamente' })
        } else {
            res.status(404).json({ error: 'Género no encontrado' })
        }
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(409).json({ error: 'No se puede eliminar el género porque está relacionado con contenido existente' })
        } else {
            res.status(500).json({ error: 'Error al eliminar el género' })
        }
    }
}

module.exports = {
    getAllGeneros,
    getByIdGenero,
    createGenero,
    updateGenero,
    deleteGenero
}
