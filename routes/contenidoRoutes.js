const express = require('express')
const router = express.Router()
const actoresController = require('../controllers/actoresController')
const categoriasController = require('../controllers/categoriasController')
const contenidoController = require('../controllers/contenidoController')
const generoController = require('../controllers/generoController')


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
 *     tags:
 *       - Actores
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
 * /contenido/agregar_relaciones/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un contenido y agregar relaciones sin reemplazarlas
 *     description: Actualiza datos parciales de un contenido existente y agrega relaciones en géneros, búsquedas y reparto evitando duplicados.
 *     tags:
 *       - Contenido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del contenido a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID del contenido, debe coincidir con el ID en la URL.
 *                 example: 101
 *               categoria_id:
 *                 type: integer
 *                 description: ID de la categoría asociada.
 *                 example: 2
 *               genero:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de géneros para agregar.
 *                 example: [1, "Comedia", "Drama"]
 *               busqueda:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de términos de búsqueda para agregar.
 *                 example: [2, "Aventura", "Acción"]
 *               reparto:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de nombres de actores para agregar.
 *                 example: [109, "Actor 1", "Actor 2"]
 *     responses:
 *       '200':
 *         description: Contenido actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contenido actualizado correctamente"
 *                 contenido:
 *                   $ref: '#/components/schemas/Contenido'
 *       '400':
 *         description: Error de validación de datos o ID inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Datos inválidos"
 *                 details:
 *                   type: string
 *                   example: "Detalles del error de validación"
 *       '404':
 *         description: Contenido no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Contenido no encontrado"
 *       '500':
 *         description: Error interno del servidor al intentar actualizar el contenido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al actualizar el contenido"
 */
router.patch('/contenido/agregar_relaciones/:id', contenidoController.patchContenidoAgregarRelaciones)

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

/**
 * @swagger
 * /contenido/actor/{id}:
 *   get:
 *     tags:
 *       - Contenido
 *     summary: Obtener un actor por ID y sus contenidos
 *     description: Obtiene los detalles de un actor específico junto con todos los contenidos en los que participa.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del actor
 *     responses:
 *       200:
 *         description: Actor y sus contenidos obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID único del actor
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   description: Nombre del actor
 *                   example: "Tom Cruise"
 *                 contenidos:
 *                   type: array
 *                   description: Lista de contenidos en los que participa el actor
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID único del contenido
 *                         example: 1
 *                       titulo:
 *                         type: string
 *                         description: Título del contenido
 *                         example: "Misión Imposible"
 *                       poster:
 *                         type: string
 *                         description: URL del póster del contenido
 *                         example: "https://example.com/poster.jpg"
 *                       resumen:
 *                         type: string
 *                         description: Resumen o descripción breve del contenido
 *                         example: "Una historia de espionaje."
 *                       temporadas:
 *                         type: integer
 *                         description: Número de temporadas (para series)
 *                         example: 1
 *                       duracion:
 *                         type: integer
 *                         description: Duración en minutos (para películas)
 *                         example: 120
 *                       trailer:
 *                         type: string
 *                         description: URL del trailer del contenido
 *                         example: "https://example.com/trailer.mp4"
 *       404:
 *         description: Actor no encontrado
 *       500:
 *         description: Error interno al obtener el actor y sus contenidos
 */
router.get('/contenido/actor/:id', contenidoController.getContenidoByIdActor)

/**
 * @swagger
 * /contenido/{id}/full:
 *   get:
 *     tags:
 *       - Contenido
 *     summary: Obtener un contenido por ID con información relacionada detallada completa
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

/**
 * @swagger
 * /contenido/{id}:
 *   get:
 *     tags:
 *       - Contenido
 *     summary: Obtener un contenido por ID con sus datos relacionados en arrays con sus Ids
 *     description: Obtiene un contenido específico por ID, incluyendo detalles completos de sus relaciones como reparto, género, categoría y términos de búsqueda.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del contenido
 *     responses:
 *       200:
 *         description: Contenido obtenido correctamente con todos sus datos relacionados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID único del contenido
 *                   example: 1
 *                 titulo:
 *                   type: string
 *                   description: Título del contenido
 *                   example: "Misión Imposible"
 *                 poster:
 *                   type: string
 *                   description: URL del póster del contenido
 *                   example: "https://example.com/poster.jpg"
 *                 resumen:
 *                   type: string
 *                   description: Resumen o descripción breve del contenido
 *                   example: "Una historia de espionaje."
 *                 temporadas:
 *                   type: integer
 *                   description: Número de temporadas (para series)
 *                   example: 1
 *                 duracion:
 *                   type: integer
 *                   description: Duración en minutos (para películas)
 *                   example: 120
 *                 trailer:
 *                   type: string
 *                   description: URL del trailer del contenido
 *                   example: "https://example.com/trailer.mp4"
 *                 reparto:
 *                   type: array
 *                   description: Lista de actores en el contenido
 *                   items:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         description: Nombre del actor
 *                         example: "Tom Cruise"
 *                 genero:
 *                   type: array
 *                   description: Lista de géneros asociados al contenido
 *                   items:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         description: Nombre del género
 *                         example: "Acción"
 *                 busqueda:
 *                   type: array
 *                   description: Lista de términos de búsqueda asociados al contenido
 *                   items:
 *                     type: object
 *                     properties:
 *                       termino:
 *                         type: string
 *                         description: Término de búsqueda
 *                         example: "Futurista"
 *                 categoria:
 *                   type: object
 *                   description: Categoría del contenido
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       description: Nombre de la categoría
 *                       example: "Película"
 *       404:
 *         description: Contenido no encontrado
 *       500:
 *         description: Error interno al obtener el contenido y sus datos relacionados
 */
router.get('/contenido/:id', contenidoController.getByIdContenido)

/**
 * @swagger
 * /contenido/:
 *   post:
 *     summary: Crear un nuevo contenido
 *     description: Crea un nuevo contenido en la plataforma, validando datos de entrada y manejando relaciones con categorías, géneros, búsquedas y reparto.
 *     tags:
 *       - Contenido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID único del contenido (opcional, se generará automáticamente si no se proporciona).
 *               titulo:
 *                 type: string
 *                 description: Título del contenido.
 *                 example: "Expedientes Secretos X"
 *               categoria_id:
 *                 type: integer
 *                 description: ID de la categoría del contenido (debe existir en la base de datos).
 *                 example: 1
 *               genero:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Géneros asociados al contenido.
 *                 example: ["Ciencia Ficción", "Misterio"]
 *               busqueda:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Términos de búsqueda asociados al contenido.
 *                 example: ["investigación", "expedientes"]
 *               reparto:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Actores principales asociados al contenido.
 *                 example: ["David Duchovny", "Gillian Anderson"]
 *               resumen:
 *                 type: string
 *                 description: Resumen o sinopsis del contenido.
 *                 example: "Dos agentes del FBI investigan casos paranormales."
 *               trailer:
 *                 type: string
 *                 description: URL del tráiler del contenido.
 *                 example: "https://www.youtube.com/watch?v=example"
 *               duracion:
 *                 type: integer
 *                 description: Duración del contenido en minutos.
 *                 example: 380
 *               temporadas:
 *                 type: integer
 *                 nullable: true
 *                 description: Número de temporadas (null si es una película).
 *                 example: 11
 *               poster:
 *                 type: string
 *                 description: URL del póster del contenido.
 *                 example: "https://www.example.com/poster.jpg"
 *             required:
 *               - titulo
 *               - categoria_id
 *               - resumen
 *               - trailer
 *               - poster
 *     responses:
 *       '201':
 *         description: Contenido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contenido'
 *       '400':
 *         description: Error de validación en los datos de entrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Datos inválidos"
 *                 details:
 *                   type: string
 *                   example: "categoria_id no encontrada, título requerido"
 *       '409':
 *         description: El contenido con el mismo ID ya existe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El registro ya existe. No se puede duplicar en la base de datos."
 *                 record:
 *                   $ref: '#/components/schemas/Contenido'
 *       '500':
 *         description: Error interno del servidor al crear el contenido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al crear el contenido"
 *                 details:
 *                   type: string
 *                   example: "Detalle del error interno"
 */
router.post('/contenido/', contenidoController.createContenido)

/**
 * @swagger
 * /contenido/{id}:
 *   put:
 *     summary: Actualizar un contenido existente
 *     description: Actualiza los datos de un contenido existente, validando los datos de entrada y gestionando relaciones con categorías, géneros, búsquedas y reparto.
 *     tags:
 *       - Contenido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contenido a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID del contenido (debe coincidir con el ID de la URL).
 *               titulo:
 *                 type: string
 *                 description: Título del contenido.
 *                 example: "Expedientes Secretos X"
 *               categoria_id:
 *                 type: integer
 *                 description: ID de la categoría del contenido (debe existir en la base de datos).
 *                 example: 1
 *               genero:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Géneros asociados al contenido.
 *                 example: ["Ciencia Ficción", "Misterio"]
 *               busqueda:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Términos de búsqueda asociados al contenido.
 *                 example: ["investigación", "expedientes"]
 *               reparto:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Actores principales asociados al contenido.
 *                 example: ["David Duchovny", "Gillian Anderson"]
 *               resumen:
 *                 type: string
 *                 description: Resumen o sinopsis del contenido.
 *                 example: "Dos agentes del FBI investigan casos paranormales."
 *               trailer:
 *                 type: string
 *                 description: URL del tráiler del contenido.
 *                 example: "https://www.youtube.com/watch?v=example"
 *               duracion:
 *                 type: integer
 *                 description: Duración del contenido en minutos.
 *                 example: 97
 *               temporadas:
 *                 type: integer
 *                 nullable: true
 *                 description: Número de temporadas (null si es una película).
 *                 example: 11
 *               poster:
 *                 type: string
 *                 description: URL del póster del contenido.
 *                 example: "https://www.example.com/poster.jpg"
 *             required:
 *               - id
 *               - titulo
 *               - categoria_id
 *               - resumen
 *               - trailer
 *               - poster
 *     responses:
 *       '200':
 *         description: Contenido actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contenido actualizado correctamente"
 *                 contenido:
 *                   $ref: '#/components/schemas/Contenido'
 *       '400':
 *         description: Error de validación en los datos de entrada o categoría no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Datos inválidos"
 *                 details:
 *                   type: string
 *                   example: "Los IDs no coinciden, categoría no válida"
 *       '404':
 *         description: Contenido no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Contenido no encontrado"
 *       '500':
 *         description: Error interno del servidor al actualizar el contenido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al actualizar el contenido"
 *                 details:
 *                   type: string
 *                   example: "Detalle del error interno"
 */
router.put('/contenido/:id', contenidoController.updateContenido)

/**
 * @swagger
 * /contenido/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un contenido existente
 *     description: Actualiza campos específicos de un contenido existente, validando solo los datos proporcionados y gestionando relaciones con categorías, géneros, búsquedas y reparto según los cambios solicitados.
 *     tags:
 *       - Contenido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contenido a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID del contenido (debe coincidir con el ID de la URL).
 *               titulo:
 *                 type: string
 *                 description: Título del contenido.
 *                 example: "Expedientes Secretos X"
 *               categoria_id:
 *                 type: integer
 *                 description: ID de la categoría del contenido, solo si se desea actualizar.
 *                 example: 1
 *               genero:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Géneros asociados al contenido, solo si se desean actualizar.
 *                 example: ["Ciencia Ficción", "Misterio"]
 *               busqueda:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Términos de búsqueda asociados al contenido, solo si se desean actualizar.
 *                 example: ["investigación", "expedientes"]
 *               reparto:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Actores principales asociados al contenido, solo si se desean actualizar.
 *                 example: ["David Duchovny", "Gillian Anderson"]
 *               resumen:
 *                 type: string
 *                 description: Resumen o sinopsis del contenido.
 *                 example: "Dos agentes del FBI investigan casos paranormales."
 *               trailer:
 *                 type: string
 *                 description: URL del tráiler del contenido.
 *                 example: "https://www.youtube.com/watch?v=example"
 *               duracion:
 *                 type: integer
 *                 description: Duración del contenido en minutos.
 *                 example: 97
 *               temporadas:
 *                 type: integer
 *                 nullable: true
 *                 description: Número de temporadas (null si es una película).
 *                 example: 11
 *               poster:
 *                 type: string
 *                 description: URL del póster del contenido.
 *                 example: "https://www.example.com/poster.jpg"
 *     responses:
 *       '200':
 *         description: Contenido actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contenido actualizado correctamente"
 *                 contenido:
 *                   $ref: '#/components/schemas/Contenido'
 *       '400':
 *         description: Error de validación en los datos de entrada o categoría no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Datos inválidos"
 *                 details:
 *                   type: string
 *                   example: "IDs no coinciden o categoría inválida"
 *       '404':
 *         description: Contenido no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Contenido no encontrado"
 *       '500':
 *         description: Error interno del servidor al actualizar el contenido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al actualizar el contenido"
 *                 details:
 *                   type: string
 *                   example: "Detalle del error interno"
 */
router.patch('/contenido/:id', contenidoController.patchContenido)

/**
 * @swagger
 * /contenido/{id}:
 *   delete:
 *     summary: Eliminar un contenido existente
 *     description: Elimina un contenido y sus relaciones asociadas en las tablas de unión (géneros, búsquedas y reparto).
 *     tags:
 *       - Contenido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del contenido a eliminar.
 *     responses:
 *       '200':
 *         description: Contenido eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contenido eliminado correctamente"
 *       '204':
 *         description: Contenido eliminado sin contenido en la respuesta.
 *       '400':
 *         description: ID inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID inválido"
 *       '404':
 *         description: Contenido no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Contenido no encontrado"
 *       '500':
 *         description: Error interno del servidor al intentar eliminar el contenido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al eliminar el contenido"
 */
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