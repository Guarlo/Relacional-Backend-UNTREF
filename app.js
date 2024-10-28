process.loadEnvFile()
const morgan = require('morgan')
const express = require('express')
const app = express()
const contenidoRoutes = require('./routes/contenidoRoutes')
//const contenidoRoutes = require('./routes/contenido')
//app.use('/api', contenidoRoutes)
// const db = require('./conexion/database')

//
// Middlewares
//
// Usar morgan como middleware para registrar las solicitudes en la consola
app.use(morgan('dev')) // Usa 'dev' para un formato de logging conciso en desarrollo
app.use(express.json())
app.use('/contenido', contenidoRoutes)

app.get('/', (req, res) => {
    res.send('BIENVENIDO A LA API DE CONTENIDOS!')
 })

// Middleware para manejar rutas inválidas
app.use((req, res, next) => {
  const err = new Error('Ruta no encontrada.')
  err.status = 404
  next(err)
})
// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.log("mdl errors!")
  res.status(err.status || 500).json({
    message: err.message,
    error: err.status
  })
})

// Server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/contenido`)
});
