// process.loadEnvFile()
const dotenv = require('dotenv')
//const ENV = local
//const ENV = 'local_guarloweb'
const ENV = 'local_railway'
dotenv.config({ path: `.env.${ENV}` })

const fs = require('fs').promises // Usamos la versión de promesas para `fs`
const Joi = require('joi')
const express = require('express')
const app = express()

const { sequelize, Contenido, Categoria, Actor, Genero, Busqueda, ContenidoActor, ContenidoBusqueda, ContenidoGenero } = require('./models')

app.use(express.json())

const contenidoSchema = Joi.object({
    id: Joi.number().integer().required(),
    poster: Joi.string().max(255).allow(null),
    titulo: Joi.string().max(255).required(),
    categoria: Joi.alternatives().try(Joi.number().integer(), Joi.string()).required(),
    resumen: Joi.string().allow(null),
    temporadas: Joi.number().integer().allow(null),
    duracion: Joi.number().integer().allow(null),
    trailer: Joi.string().max(255).allow(null),
    genero: Joi.array().items(Joi.alternatives().try(Joi.number().strict(), Joi.string().strict())).required(),
    busqueda: Joi.array().items(Joi.alternatives().try(Joi.number().strict(), Joi.string().strict())).required(),
    reparto: Joi.array().items(Joi.alternatives().try(Joi.number().strict(), Joi.string().strict())).required()
})


function transformarObjeto(objetoOriginal) {
    const nuevoObjeto = { ...objetoOriginal }

    // Eliminar el elemento 'gen'
    delete nuevoObjeto.gen

    // Manejar el campo 'temporadas'
    if (!nuevoObjeto.temporadas || isNaN(nuevoObjeto.temporadas)) {
        nuevoObjeto.temporadas = 0
    } else {
        nuevoObjeto.temporadas = Number(nuevoObjeto.temporadas) // Asegúrate de convertirlo a número
    }

    // Manejar el campo 'duracion' para extraer el número
    if (typeof nuevoObjeto.duracion === 'string' && nuevoObjeto.duracion.includes(' ')) {
        const match = nuevoObjeto.duracion.match(/\d+/) // Busca el primer número en la cadena
        nuevoObjeto.duracion = match ? Number(match[0]) : 0 // Si hay un número, convertir a número, si no, asignar 0
    } else if (isNaN(nuevoObjeto.duracion)) {
        nuevoObjeto.duracion = 0
    }

    // Dividir, limpiar y eliminar duplicados en 'reparto', 'genero' y 'busqueda'
    // Crear un conjunto ignorando mayúsculas y minúsculas
    nuevoObjeto.reparto = [
        ...new Map(
            nuevoObjeto.reparto
                .split(',')
                .map(actor => [actor.toLowerCase().trim(), actor.trim()])
                .filter(([key, value]) => value) // Filtra valores vacíos o nulos
        ).values()
    ]
    nuevoObjeto.genero = [
        ...new Map(
            nuevoObjeto.genero
                .split(',')
                .map(genero => [genero.toLowerCase().trim(), genero.trim()])
                .filter(([key, value]) => value) // Filtra valores vacíos o nulos
        ).values()
    ]
    nuevoObjeto.busqueda = [
        ...new Map(
            nuevoObjeto.busqueda
                .split(',')
                .map(busqueda => [busqueda.toLowerCase().trim(), busqueda.trim()])
                .filter(([key, value]) => value) // Filtra valores vacíos o nulos
        ).values()
    ]

    return nuevoObjeto
}

const obtenerTrailerflix = async () => {
    try {
        const data = await fs.readFile('./json/trailerflix.json', 'utf8')
        const arrayOriginalContenido = JSON.parse(data)
        const arrayNewContenido = arrayOriginalContenido.map(objeto => transformarObjeto(objeto))

        // Obtener la fecha y hora actual en formato YYYYMMDD_HHMMSS
        const date = new Date()
        const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`

        // Crear el nombre del archivo con la fecha y hora
        const fileName = `./output/arrayNewContenido_${formattedDate}.json`

        // Escribir en el archivo
        await fs.writeFile(fileName, JSON.stringify(arrayNewContenido, null, 2))

        return arrayNewContenido
    } catch (err) {
        console.error('Error al leer o escribir el archivo:', err)
        return []
    }
}

const procesarArrayContenido = async (arrayNewContenido) => {
    for (const objeto of arrayNewContenido) {
        try {
            const resultado = await createContenido(objeto)
        } catch (error) {
            console.error("Error al procesar el contenido:", error.message)
        }
    }
}

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

// Crear un nuevo contenido con validación de datos y relaciones
const createContenido = async (contenidoData) => {
    // Validación de los datos de entrada
    const { error, value } = contenidoSchema.validate(contenidoData)
    if (error) {
        console.error("Error de validación en createContenido:", error.details.map(e => e.message).join(", "))
        throw new Error("Error de validación de datos: " + error.details.map(e => e.message).join(", "))
    }

    const { genero, busqueda, reparto, categoria, ...data } = value

    const contenidoId = data.id
    try {
        // Verificar si ya existe un contenido con el mismo ID
        const existingContenido = await Contenido.findByPk(contenidoId)
        if (existingContenido) {
            console.log("El contenido ya existe en la base de datos." + contenidoId)
            return existingContenido
        }

        // Obtener los IDs de relaciones y categoría
        const generoIds = await findOrCreateIds(genero, Genero, 'nombre')
        const busquedaIds = await findOrCreateIds(busqueda, Busqueda, 'termino')
        const repartoIds = await findOrCreateIds(reparto, Actor, 'nombre')
        const categoriaIds = await findIds([categoria], Categoria, 'nombre')

        // Crear el contenido en una transacción
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

        return contenido

    } catch (error) {
        console.error("Error al crear el contenido:", error.message || error)
        throw new Error(error.message || 'Error al crear el contenido')
    }
}

// Función principal para ejecutar todo
const main = async () => {
    const arrayNewContenido = await obtenerTrailerflix() // Esperamos a que se obtenga el contenido
    await procesarArrayContenido(arrayNewContenido) // Procesamos el array
}

// Ejecutar la función principal
main()
