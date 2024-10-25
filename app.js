process.loadEnvFile()
const express = require('express')
const app = express()
const contenidoRoutes = require('./routes/contenidoRoutes')
// const db = require('./conexion/database')

// Middlewares
app.use(express.json())
app.use('/contenido', contenidoRoutes)


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
