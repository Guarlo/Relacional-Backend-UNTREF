const fs = require('fs')
const Actor = require('../models/actor')

// Controlador para traer todos los actores
const getAllActors = async (req, res) => {
  try {
    const actors = await Actor.findAll()

    // Verificar si la lista está vacía
    if (actors.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron actores',
        error: 404
      })
    }
    res.status(200).json(actors)

  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener actores',
      informe: error.message,
      error: error
    })   
}
}


// Función para extraer el valor numérico de la duración
function obtenerDuracionEnMinutos(duracion) {
  if (typeof duracion === 'string') {
    const minutos = duracion.match(/\d+/) // Extraer los dígitos
    return minutos ? parseInt(minutos[0], 10) : null
  }
  return duracion // Si ya es un número, lo devuelve tal cual
}

// Función para ajustar las comillas simples y reemplazarlas por backticks
function ajustarComillasSimples(valor) {
  if (typeof valor === 'string') {
    return valor.replace(/'/g, '`') // Reemplazar comillas simples por backticks
  }
  return valor
}

/**
/ Función para migrar el contenido del archivo JSON a una base de datos MySQL
/ migrarTrailerflixJSON
**/
const migrarTrailerflixJSON = (req, res) => {
  // Leer el archivo JSON
  //fs.readFileSync('./json/trailerflix.json', 'utf8', (err, data) => {
  fs.readFile('./json/trailerflix.json', 'utf8', (err, data) => {
    if (err) {
      res.send('Error al leer el archivo:', err)
    }

    // Parsear el contenido del JSON
    const contenido = JSON.parse(data)

    //     // ********************************************************************************************************
    // const insertQuery = `INSERT INTO contenido (id, poster, titulo, categoria_id, resumen, temporadas, duracion, trailer) VALUES`
    // console.log(insertQuery)

    // // Recorre cada elemento y genera las sentencias INSERT
    // contenido.forEach(item => {
    //   //console.log(item.temporadas !== undefined && item.temporadas !== 'N/A' ? item.temporadas : 'NULL')
    //   if (item.id < 100) {
    //     // Ajusta el campo duración
    //     const duracionEnMinutos = obtenerDuracionEnMinutos(item.duracion)
    //     const duracionAjustado = item.duracion !== undefined ? duracionEnMinutos : 'NULL'

    //     // Ajustar los valores con comillas simples si es necesario
    //     const tituloAjustado = ajustarComillasSimples(item.titulo)
    //     const resumenAjustado = ajustarComillasSimples(item.resumen)
    //     const temporadasAjustado = item.temporadas === undefined || item.temporadas === 'N/A' || item.temporadas === '' ? 'NULL' : item.temporadas
    //     //console.log(`ID: > ${item.id}`) 
    //     //console.log(item.temporadas === undefined)
    //     //console.log(item.temporadas === '')
    //     //console.log(`--> ${item.temporadas}`) 
    //     //console.log(item.temporadas === undefined || item.temporadas === 'N/A' || item.temporadas === '' ? 'NULL' : item.temporadas)
    //     // Generar los valores con cada campo en una línea separada
    //     const values = `(${item.id}, '${item.poster}', '${tituloAjustado}', (SELECT id FROM categorias WHERE nombre = '${item.categoria}'), '${resumenAjustado}', ${temporadasAjustado}, ${duracionAjustado}, '${item.trailer}'),`
    //     // Imprimir el resultado en la consola
    //     console.log(values)
    //   }
    //     // ********************************************************************************************************

    // Acumulador para almacenar las sentencias SQL
    let insertActoresStatements = ''
    insertActoresStatements += `INSERT INTO contenido_actores (contenido_id, actor_id) VALUES \n`
    // Recorre cada elemento y genera las sentencias INSERT para actores
    contenido.forEach(item => {
      // Parsear el campo reparto y generar las sentencias para la tabla contenido_actores
      const reparto = item.reparto.split(',').map(actor => actor.trim())

      reparto.forEach(actor => {
        // Generar la sentencia INSERT para cada actor del reparto
        insertActoresStatements += `(${item.id}, (SELECT id FROM actores WHERE nombre = '${actor.replace(/'/g, '`')}')),\n`
      })
    })
    // Imprimir el resultado en la consola
    console.log(insertActoresStatements)



    //********************************************************************************************************
    res.send('Acá se exporta migrarTrailerflixJSON')
  })
}


/**
/ Función para migrar el contenido del archivo JSON a una base de datos MySQL
/ migrarTrailerflixJSON
**/


module.exports = { migrarTrailerflixJSON, getAllActors }