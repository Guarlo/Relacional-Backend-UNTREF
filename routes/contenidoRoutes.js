const express = require('express')
const router = express.Router()
const db = require('../conexion/database')

const contenidoController = require('../controllers/contenidoController.js')

// Routes for CRUD
router.get('/', (req, res) => {
    // Get all content
    res.send('Hola mundo !')
})

router.get('/actors', contenidoController.getAllActors);


router.get('/:id', (req, res) => {
    // Get content by ID
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

module.exports = router
    