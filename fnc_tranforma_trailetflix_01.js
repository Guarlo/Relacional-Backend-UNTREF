function transformarObjeto(objetoOriginal) {
    // Crear una copia del objeto original para evitar modificar el original
    const nuevoObjeto = { ...objetoOriginal }

    // Dividir los valores de 'genero' y 'busqueda' y crear arreglos
    nuevoObjeto.reparto = nuevoObjeto.reparto.split(',').map(actor => actor.trim())
    nuevoObjeto.genero = nuevoObjeto.genero.split(',').map(genero => genero.trim())
    nuevoObjeto.busqueda = nuevoObjeto.busqueda.split(',').map(busqueda => busqueda.trim())

    // Modificar los valores de los arreglos (ejemplo)
    // nuevoObjeto.genero.push('Acción')
    //nuevoObjeto.busqueda.push('Joaquin Phoenix')

    return nuevoObjeto
}

// Ejemplo de uso
const objetoOriginal = {

    "id": 3,
    "poster": "./posters/3.jpg",
    "titulo": "The Mandalorian",
    "categoria": "Serie",
    "genero": "Sci-Fi, Fantasía, Acción",
    "gen": "Ciencia Ficción",
    "busqueda": "The Mandalorian, Sci-Fi, Fantasía, Suspenso, Pedro Pascal, Carl Weathers, Misty Rosas, Chris Bartlett, Rio Hackford, Giancarlo Esposito",
    "resumen": "Ambientada tras la caída del Imperio y antes de la aparición de la Primera Orden, la Serie sigue los pasos de un pistolero solitario en las aventuras que protagoniza en los confines de la galaxia, donde no alcanza la autoridad de la Nueva República.",
    "temporadas": 2,
    "reparto": "Pedro Pascal, Carl Weathers, Misty Rosas, Chris Bartlett, Rio Hackford, Giancarlo Esposito",
    "trailer": "https://www.youtube.com/embed/aOC8E8z_ifw"

}

const objetoTransformado = transformarObjeto(objetoOriginal)
console.log(objetoTransformado)