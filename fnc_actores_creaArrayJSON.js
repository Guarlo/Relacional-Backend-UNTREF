const fs = require('fs')

const actoresCreaArrayJSON = (req, res) => {
    fs.readFile('./json/trailerflix.json', 'utf8', (err, data) => {
        if (err) {
            console.log('Error al leer el archivo:', err)
            return
        }

        const contenido = JSON.parse(data)
        let arrayActores = []

        contenido.forEach(item => {
            // Parsear el campo reparto y generar el array de actores únicos
            const reparto = item.reparto.split(',').map(actor => actor.trim())

            reparto.forEach(actor => {
                // Agregar al array si no existe un actor con el mismo nombre
                if (!arrayActores.some((item) => item.nombre === actor)) {
                    arrayActores.push({ nombre: actor })
                }
            })
        })

        // Escribir el array en un archivo JSON
        fs.writeFile('./output/actoresUnicos.json', JSON.stringify(arrayActores, null, 2), (err) => {
            if (err) {
                console.log('Error al escribir el archivo:', err)
            } else {
                console.log('Archivo de actores únicos creado exitosamente')
            }
        })
    })
}

actoresCreaArrayJSON()