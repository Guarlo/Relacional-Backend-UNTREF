const express = require('express')
const router = express.Router()
//const contenidoController = require('../controllers/contenidoController.js')
const actoresController = require('../controllers/actoresController.js')
const categoriasController = require('../controllers/categoriasController.js')
const contenidoController = require('../controllers/contenidoController')
const generoController = require('../controllers/generoController')

// Routes for CRUD
// router.get('/', (req, res) => {
//     // Get all content
//     res.send('Hola mundo !')
// })

//router.get('/migrar', contenidoController.migrarTrailerflixJSON)

router.get('/', (req, res) => {
    res.send('BIENVENIDO A LA API DE CONTENIDOS!')
})

router.get('/categorias', categoriasController.getAllCategorias)
router.get('/categorias/:id', categoriasController.getByIdCategoria)
router.post('/categorias', categoriasController.createCategoria)
router.put('/categorias/:id', categoriasController.updateCategoria)
router.patch('/categorias/:id', categoriasController.patchCategoria)
router.delete('/categorias/:id', categoriasController.deleteCategoria)

router.get('/generos', generoController.getAllGeneros)
router.get('/generos/:id', generoController.getByIdGenero)
router.post('/generos', generoController.createGenero)
router.put('/generos/:id', generoController.updateGenero)
router.delete('/generos/:id', generoController.deleteGenero)

router.get('/actores', actoresController.getAllActors)

/**
 * @swagger
 * /actores/{id}:
 *   get:
 *     summary: Obtener un actor por ID
 *     description: Endpoint para obtener un actor específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del actor
 *     responses:
 *       200:
 *         description: Actor encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       404:
 *         description: Actor no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/actores/:id', actoresController.getByIdActor)

router.post('/actores', actoresController.createActor)
router.post('/actores/bulk', actoresController.bulkCreateActors)
router.put('/actores/:id', actoresController.updateActor)
router.patch('/actores/:id', actoresController.patchActor) // Ruta PATCH
router.delete('/actores/:id', actoresController.deleteActor)


/**
 * @swagger
 * /contenido/:
 *   get:
 *     tags:
 *       - Contenido
 *     summary: Obtener todos los contenidos con filtros opcionales
 *     description: Obtiene todos los contenidos, con la opción de aplicar filtros por categoría, género, término de búsqueda y reparto.
 *     parameters:
 *       - name: genero
 *         in: query
 *         description: Nombre del género para filtrar contenidos.
 *         required: false
 *         schema:
 *           type: string
 *           example: "Acción"
 *       - name: busqueda
 *         in: query
 *         description: Término de búsqueda para filtrar contenidos.
 *         required: false
 *         schema:
 *           type: string
 *           example: "Mission Impossible"
 *       - name: reparto
 *         in: query
 *         description: Nombre del actor para filtrar contenidos.
 *         required: false
 *         schema:
 *           type: string
 *           example: "Tom Cruise"
 *       - name: categoria
 *         in: query
 *         description: ID de la categoría para filtrar contenidos.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Lista de contenidos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID único del contenido
 *                     example: 1
 *                   poster:
 *                     type: string
 *                     description: URL del póster del contenido
 *                     example: "https://example.com/poster.jpg"
 *                   titulo:
 *                     type: string
 *                     description: Título del contenido
 *                     example: "Misión Imposible"
 *                   categoria:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         description: Nombre de la categoría
 *                         example: "Película"
 *                   resumen:
 *                     type: string
 *                     description: Resumen o descripción breve del contenido
 *                     example: "Una historia de espionaje."
 *                   temporadas:
 *                     type: integer
 *                     description: Número de temporadas (para series)
 *                     example: 1
 *                   duracion:
 *                     type: integer
 *                     description: Duración en minutos (para películas)
 *                     example: 120
 *                   trailer:
 *                     type: string
 *                     description: URL del trailer del contenido
 *                     example: "https://example.com/trailer.mp4"
 *                   genero:
 *                     type: array
 *                     description: Lista de géneros asociados al contenido
 *                     items:
 *                       type: object
 *                       properties:
 *                         nombre:
 *                           type: string
 *                           description: Nombre del género
 *                           example: "Acción"
 *                   busqueda:
 *                     type: array
 *                     description: Lista de términos de búsqueda asociados al contenido
 *                     items:
 *                       type: object
 *                       properties:
 *                         termino:
 *                           type: string
 *                           description: Término de búsqueda
 *                           example: "Mission Impossible"
 *                   reparto:
 *                     type: array
 *                     description: Lista de actores en el contenido
 *                     items:
 *                       type: object
 *                       properties:
 *                         nombre:
 *                           type: string
 *                           description: Nombre del actor
 *                           example: "Tom Cruise"
 *       500:
 *         description: Error al obtener los contenidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "No se pudieron obtener los contenidos"
 */
router.get('/contenido/', contenidoController.getAllContenido)



router.get('/contenido/actor/:id', contenidoController.getContenidoByIdActor)

/**
 * @swagger
 * /contenido/{id}/full:
 *   get:
 *     summary: Obtener contenido detallado con información relacionada
 *     description: Endpoint para obtener el detalle completo de un contenido, incluyendo actores, géneros, términos de búsqueda y categoría.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contenido para obtener el detalle completo
 *     responses:
 *       200:
 *         description: Detalle completo del contenido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *                 poster:
 *                   type: string
 *                   example: "./posters/actor-5.jpg"
 *                 titulo:
 *                   type: string
 *                   example: "The Mandalorian"
 *                 categoria:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       example: "Serie"
 *                 genero:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Sci-Fi"
 *                 busqueda:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Pedro Pascal"
 *                 resumen:
 *                   type: string
 *                   example: "Serie ambientada en el universo de Star Wars..."
 *                 temporadas:
 *                   type: integer
 *                   example: 2
 *                 duracion:
 *                   type: integer
 *                   example: 45
 *                 reparto:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Pedro Pascal"
 *                 trailer:
 *                   type: string
 *                   example: "https://www.youtube.com/embed/trailer12345"
 *       400:
 *         description: ID del contenido inválido
 *         content:
 *           application/json:
 *             example:
 *               error: ID del contenido inválido
 *       404:
 *         description: Contenido no encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: Contenido no encontrado para el ID especificado
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             example:
 *               error: Error al obtener el contenido y sus relaciones
 */
router.get('/contenido/:id/full', contenidoController.getByIdContenidoFull)

router.get('/contenido/:id', contenidoController.getByIdContenido)

router.post('/contenido/:id', contenidoController.createContenido)
router.put('/contenido/:id', contenidoController.updateContenido)
router.patch('/contenido/:id', contenidoController.patchContenido)
router.delete('/contenido/:id', contenidoController.deleteContenido)

// Middleware para manejar rutas inválidas
router.use((req, res, next) => {
    const err = new Error('Ruta de contenidos no encontrada.')
    err.status = 404
    next(err)
});

// Middleware de manejo de errores
router.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        messageq: err.message,
        error: err.status
    })
})

module.exports = router