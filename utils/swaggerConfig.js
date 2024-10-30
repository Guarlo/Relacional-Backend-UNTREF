const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Contenidos',
      version: '1.0.0',
      description: 'Documentación generada con Swagger para la API de Contenidos'
    },
    servers: [
      {
        url: 'http://localhost:3000/apicontenido',
      }
    ],
    components: {
      schemas: {
        Actor: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del actor',
              example: 1
            },
            nombre: {
              type: 'string',
              description: 'Nombre del actor',
              example: 'John Doe'
            }
          },
          required: ['nombre']
        },
        Busqueda: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la búsqueda',
              example: 1
            },
            termino: {
              type: 'string',
              description: 'Término de búsqueda',
              example: 'acción'
            }
          },
          required: ['termino']
        },
        Categoria: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la categoría',
              example: 1
            },
            nombre: {
              type: 'string',
              description: 'Nombre de la categoría',
              example: 'Películas'
            }
          },
          required: ['nombre']
        },
        // Schema for Genero
        Genero: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del género',
              example: 1
            },
            nombre: {
              type: 'string',
              description: 'Nombre del género',
              example: 'Drama'
            }
          },
          required: ['nombre']
        },

        // Schema for Contenido
        Contenido: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del contenido',
              example: 1
            },
            poster: {
              type: 'string',
              description: 'URL del póster del contenido',
              example: 'https://ejemplo.com/poster.jpg'
            },
            titulo: {
              type: 'string',
              description: 'Título del contenido',
              example: 'Breaking Bad'
            },
            categoria_id: {
              type: 'integer',
              description: 'ID de la categoría asociada',
              example: 2
            },
            resumen: {
              type: 'string',
              description: 'Resumen de la trama o contenido',
              example: 'Un profesor de química se convierte en productor de metanfetamina.'
            },
            temporadas: {
              type: 'integer',
              description: 'Número de temporadas del contenido',
              example: 5
            },
            duracion: {
              type: 'integer',
              description: 'Duración en minutos o capítulos',
              example: 60
            },
            trailer: {
              type: 'string',
              description: 'URL del trailer del contenido',
              example: 'https://ejemplo.com/trailer.mp4'
            },
            // Propiedades para relaciones
            categoria: {
              $ref: '#/components/schemas/Categoria' // Relación belongsTo con Categoria
            },
            genero: {
              type: 'array', // Relación belongsToMany con Genero
              items: { $ref: '#/components/schemas/Genero' }
            },
            reparto: {
              type: 'array', // Relación belongsToMany con Actor
              items: { $ref: '#/components/schemas/Actor' }
            },
            busqueda: {
              type: 'array', // Relación belongsToMany con Busqueda
              items: { $ref: '#/components/schemas/Busqueda' }
            }
          },
          required: ['titulo', 'categoria_id']
        },

        // Schema for ContenidoActor
        ContenidoActor: {
          type: 'object',
          properties: {
            contenido_id: {
              type: 'integer',
              description: 'ID del contenido asociado',
              example: 1
            },
            actor_id: {
              type: 'integer',
              description: 'ID del actor asociado',
              example: 1
            }
          },
          required: ['contenido_id', 'actor_id']
        },

        // Schema for ContenidoBusqueda
        ContenidoBusqueda: {
          type: 'object',
          properties: {
            contenido_id: {
              type: 'integer',
              description: 'ID del contenido asociado',
              example: 1
            },
            busqueda_id: {
              type: 'integer',
              description: 'ID de la búsqueda asociada',
              example: 1
            }
          },
          required: ['contenido_id', 'busqueda_id']
        },

        // Schema for ContenidoGenero
        ContenidoGenero: {
          type: 'object',
          properties: {
            contenido_id: {
              type: 'integer',
              description: 'ID del contenido asociado',
              example: 1
            },
            genero_id: {
              type: 'integer',
              description: 'ID del género asociado',
              example: 1
            }
          },
          required: ['contenido_id', 'genero_id']
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Descripción del error',
              example: 'Actor no encontrado'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)

module.exports = { swaggerDocs, swaggerUi }
