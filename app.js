//process.loadEnvFile()
const dotenv = require('dotenv')
const ENV = process.env.NODE_ENV || 'local'
dotenv.config({ path: `.env.${ENV}` })
//if (ENV === 'local' || ENV === 'local_guarloweb' || ENV === 'local_railway') {
//  console.log(`.env.${ENV}`)
//  console.log(`host: ${process.env.DB_HOST}`)
//}

const morgan = require('morgan')
const express = require('express')
const app = express()
const contenidoRoutes = require('./routes/contenidoRoutes')
const { swaggerDocs, swaggerUi } = require('./utils/swaggerConfig')

//----------------------------------------------------------------
// Middlewares
//----------------------------------------------------------------
// Swagger Config
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Morgan para registrar las solicitudes en la consola
app.use(morgan('dev'))
//--
app.use(express.json())

//----------------------------------------------------------------
// Bienvenida
//----------------------------------------------------------------
app.get('/', (req, res) => {
  res.redirect(301, 'http://localhost:3000/apicontenido')
})

//----------------------------------------------------------------
// Routes
//----------------------------------------------------------------
app.use('/apicontenido', contenidoRoutes)


//----------------------------------------------------------------
// Middleware para manejar rutas inválidas
//----------------------------------------------------------------
app.use((req, res, next) => {
  const err = new Error('Ruta no encontrada.')
  err.status = 404
  next(err)
})
//----------------------------------------------------------------
// Middleware de manejo de errores
//----------------------------------------------------------------
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: err.status
  })
})

// Server
const PORT = process.env.PORT || 3000
const SERVER_URL = process.env.SERVER_URL || 'http://localhost'
app.listen(PORT, () => {
  console.log(`Conectando a DB host:  ${process.env.DB_HOST}`)
  console.log(`Usando configuración:  .env.${ENV}`)
                  
  if (ENV === 'production' || ENV === 'railway_guarloweb') {
    console.log(`Server running on port ${SERVER_URL}/apicontenido`)
    console.log(`Docuentación de la API en ${SERVER_URL}/api-docs`)
  } else {
    console.log(`Server running on port ${SERVER_URL}:${PORT}/apicontenido`)
    console.log(`Docuentación de la API en ${SERVER_URL}:${PORT}/api-docs`)
  }
})
