process.loadEnvFile()
const express = require('express')
const app = express()
const contenidoRoutes = require('./routes/contenidoRoutes')
const db = require('./conexion/database')

// Middlewares
app.use(express.json())
app.use('/contenido', contenidoRoutes)

// Server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
});
    