# Proyecto Integrador: CRUD con Node.js y MySQL

## Descripción del Proyecto

En este proyecto, se desarrolla una plataforma de streaming usando Node.js y MySQL. La aplicación permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre una base de datos relacional, utilizando el archivo trailerflix.json como referencia para diseñar el modelo de datos.

#### Dataset Proporcionados

- **trailerflix.json**: Contiene información detallada sobre contenido de la plataforma, como películas y series. 
- Este archivo se usa como base para diseñar el modelo de datos.

### Herramientas utilizadas
- La **I.A.** ha sido de una ayuda invaluable, pero dado que los resultados de ésta, para transformar el archivo *trailerflix.json* en un formato para insertar en MySQL fueron negativos, decidí usar JS para crear una función  llamada fnc_migra_trailerflix.js 
- Workbench para diseñar, crear y administrar la base de datos.
- Documentación.

### Dependencias utilizadas
    "express": "^4.21.1",
    "joi": "^17.13.3",
    "morgan": "^1.10.0",
    "mysql2": "^3.11.3",
    "sequelize": "^6.37.4",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1"


## Etapas del proyecto
1. **Diseñar el modelo de datos** basado en trailerflix.json.
2. **Implementar las tablas** en DB Designer, asegurando que haya relaciones adecuadas entre ellas.
3. **Generar el archivo SQL** para crear las tablas en MySQL.
4. **Migrar los datos** del archivo JSON a MySQL utilizando los insert correspondientes.

## Diseño del modelo de Base de Datos
El archivo trailerflix.json incluye propiedades como ID, título, categorías, géneros, resumen, temporadas, reparto y enlaces a trailers. 

- El diseño incluye un bocetado implementado en la plataforma **Workbench**.
- En la carpeta /documentation/diagrama_entidad_relacion/ se encuentra la documentació:       
-  ./documentation/diagrama_entidad_relacion/EER_Diagram.png (contiene una imagen del modelo)
-  ./documentation/diagrama_entidad_relacion/EER_Diagram.mwb (contiene un modelo para abrir desde Workbench)

## Tablas creadas en la base de datos.
Basado en esta estructura, se diseñó una base de datos llamada trailerflix con 8 tablas relacionales.
- **contenido**: Tabla principal con la información de películas y series.
- **categorías**: Define si el contenido es una película o una serie.
- **generos**: Almacenará los géneros como Ciencia Ficción, Fantasía, etc.
- **actores**: Información sobre los actores principales de cada contenido.
- **busquedas**: Información sobre los términos para bsuscar contenidos.
- tabla intermedia **contenido-actores**: Relaciona el contenido con los actores.
- tabla intermedia **contenido-busquedas**: Relaciona el contenido con los busqueda.
- tabla intermedia **contenido-generos**: Relaciona el contenido con los géneros.


## Archivos SQL
En la carpeta ./database están los achivos .sql para crear la DB y otras acciones:
  -  ./database/trailerflixDump20241029_completa.sql 
  -  ./database/trailerflixDump20241029_estructura.sql 
  -  ./database/trailerflixDump20241029_datos.sql
  -  ./database/Linpiar DB trailerflix.sql


## Migración de dato (caso particular)!
La importación de datos está hecha en JS mediate la función fnc_migra_trailerflix.js. Esta función lee el archivo trailerflix.json, le hace ajustes para que cumpla con el formato de **POST_http://localhost:3000/apicontenido/contenido/** y carga la totalidad de las tablas creando todos los registros para cada una de las tablas y arma las relaciones correspondientes. Evalúa repeticiones, datos nulos en algunos de los objetos y datos mal formados que llegan desde el archivo trailerflix.json.



## Funcionalidades del CRUD

1. **Obtener todos los contenidos**
   - Endpoint que devuelve todos los contenidos de la base de datos.
   - Control de errores para manejar la indisponibilidad de la base de datos.

2. **Obtener un contenido por ID**
   - Endpoint para obtener un contenido específico.
   - Control de errores para manejar casos en que el contenido no exista.

3. **Filtrar contenidos**
   - Endpoint para filtrar por título, género o categoría.
   - Control de errores para manejar coincidencias no encontradas o problemas de conexión.

4. **Agregar un nuevo contenido**
   - Endpoint para agregar una nueva pelicula o serie a la base de datos.
   - Validación de campos obligatorios.

5. **Actualizar un contenido:**
   - Endpoint para actualizar información como temporadas o reparto.
   - Control de errores para manejar actualizaciones fallidas.
     
6. **Eliminar un contenido**
   - Endpoint para eliminar un contenido de la base de datos.
   - Control de errores para manejar problemas durante el borrado.

7. **Control de errores**
   - Manejo de errores en la estructura de las solicitudes y respuestas.
   - Respuesta adecuada con mensajes y códigos de error específicos.
   - Control de acceso a rutas no existentes con respuestas apropiadas.
  


## Documentación de los endpoint de la API
 La documentacion de los endpoint se realiza mediante *Swagger*.
- Punto de acceso: http://localhost:3000/api-docs
Algunas de las funciones se pueden probar desde esta url de documentación.



## Uso de los endpoint mediante api.http
Mediante **REST Client** se crea api.http donde se pueden probar los endpoint de la API
- Punto de acceso: http://localhost:3000/apicontenido


## Estructura del Repositorio

```plaintext
/database/
  - Linpiar DB trailerflix.sql
  - trailerflixDump20241029_completa.sql
  - trailerflixDump20241029_datos.sql
  - trailerflixDump20241029_estructura.sql
/controllers/
  - actoresController.js
  - busquedasController.js
  - categoriasController.js
  - contenidoController.js
  - generoController.js
  - gralController.js  
/json/
  - trailerflix.json
/conexion/
  - database.js
/models/
  - Actor.js
  - Busqueda.js
  - Categoria.js
  - Contenido.js
  - ContenidoActor.js
  - ContenidoBusqueda.js
  - ContenidoGenero.js
  - genero.js
  - index.js
/routes/
  - contenidoRoutes.js
/.env - copia
/README.md
/app.js
/fnc_migra_trailerflix.js
/api.http
```

### Descripción de Archivos

- **/json**: Contiene el archivo trailerflix.json con los datos de películas y series.
- **/README.md**: Este archivo, con la descripción del proyecto.
- **/app.js**: Archivo principal de la aplicación Node.js.
- **/conexion/database.js**: Configuración de la conexión a MySQL.
- **/models/**: Modelos de datos para las tablas en MySQL.
- **/routes/**: Definición de las rutas y endpoints del CRUD.
- **/fnc_migra_trailerflix.js/**: Función para migrar *trailerflix.json*




1. Se agregan a los siguientes usuarios como colaboradores en este repositorio:
   - [FabioDrizZt](https://github.com/FabioDrizZt)
   - [JuanNebbia](https://github.com/JuanNebbia)
   - [NKrein](https://github.com/NKrein)
   - [mathiasbarbosa](https://github.com/mathiasbarbosa)

## Conclusión

Este proyecto permite aplicar conceptos claves de desarrollo backend, diseño de bases de datos y documentación. 

Este es un desafío para mí; volver a estudiar a este nivel despues de treinta años de mis primeros pasos en el mundo de sistemas.

"Gracias a todos los docentes por la calida humana y el profecionalismo!"

---

