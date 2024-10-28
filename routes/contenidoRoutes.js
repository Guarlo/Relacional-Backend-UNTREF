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
router.get('/actores/:id', actoresController.getByIdActor)
router.get('/actores/:actorId/contenido', actoresController.getByIdActorContenido)
router.post('/actores', actoresController.createActor)
router.post('/actores/bulk', actoresController.bulkCreateActors)
router.put('/actores/:id', actoresController.updateActor)
router.patch('/actores/:id', actoresController.patchActor) // Ruta PATCH
router.delete('/actores/:id', actoresController.deleteActor)

router.get('/', contenidoController.getAllContenido)
router.get('/:id/full', contenidoController.getByIdContenidoFull)
router.get('/:id', contenidoController.getByIdContenido)
router.post('/', contenidoController.createContenido)
router.put('/:id', contenidoController.updateContenido)
router.delete('/:id', contenidoController.deleteContenido)

// // Get content by ID
// router.get('/:id', (req, res) => {
//     res.status(404).json({
//         message: 'contenido no encontrado!',
//         error: 404
//     })
// })

// router.post('/', (req, res) => {
//     // Add new content
// })

// router.put('/:id', (req, res) => {
//     // Update content by ID
// })

// router.delete('/:id', (req, res) => {
//     // Delete content by ID
// })


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
