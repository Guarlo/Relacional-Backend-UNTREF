const express = require('express')
const router = express.Router()
const contenidoController = require('../controllers/contenidoController.js')


// Routes for CRUD
router.get('/', (req, res) => {
    // Get all content
    res.send('Hola mundo !')
})

router.get('/migrar', contenidoController.migrarTrailerflixJSON);

router.get('/actores', contenidoController.getAllActors);

// Get content by ID
router.get('/:id', (req, res) => {
    res.status(404).json({
        message: 'contenido no encontrado!',
        error: 404
    })
})

router.post('/', (req, res) => {
    // Add new content
})

router.put('/:id', (req, res) => {
    // Update content by ID
})

router.delete('/:id', (req, res) => {
    // Delete content by ID
})


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
