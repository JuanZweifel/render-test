/*necesitan hacer npm install para instalar las dependencias de node.js, express y nodemon*/

const morgan = require("morgan")
const express = require("express") // creamos una constante con la libreria express

const app = express() // creamos la app
app.use(express.json()) // seteamos que use el motor de express para procesar el json y su header (application/json)
app.use(morgan("tiny"))


// este array funciona como tu "base de datos"
let phonebook = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

// esta funciona generara un ID para cada contacto nuevo usando los correlativos de la lista (1,2,3,4...n)
function generatedID(array) {
    /* el math.max recibe una lista de numeros, pero al ser "phonebook" una lista de objetos
    utilizamos el operador de propagacion "..." para que descomponga el array dejando solo sus id
    luego math.max nos entrega el id maximo y podremos retornar el id maximo + 1 para el nuevo contacto*/
    const id = array.length > 0 ? Math.max(...array.map(contact => contact.id)) : 0

    // retornamos el id + 1 para el nuevo contacto
    return id + 1
}

// url base de la api que retorna un mensaje simple
app.get("/", (request, response) => {
    response.send("<p>Running with node.js and express</p>");
})

// url de la api que retorna todos los contactos
app.get("/api/phonebook", (request, response) => {
    morgan(':method :url :status :res[content-length] - :response-time ms')
    response.json(phonebook) // retornamos la lista de contactos transformada en json
})


// url de la api que retorna un contacto segun su ID
app.get("/api/phonebook/:id", (request, response) => {
    /*En express todo lo que se coloca en la url, que es un parametro, en este caso el :id, quedara registrado
    dentro de la peticion con la clave "params" lo que hacemos es obtener la id de la url usando request.params.id */
    const id = Number(request.params.id)

    const contact = phonebook.find(contact => contact.id === id) // buscamos un contacto con esa ID
    if (contact) // si el contacto existe 
    {
        response.status(200).json(contact) // retornamos el contacto con formato json
    }
    else // si no existe
    {
        response.status(404).json({
            error: `contact with id ${id} not found`
        }) // arrojamos un error con codigo 404 y un mensaje personalizado
    }
})


// url de la api que guarda un nuevo contacto en la lista
app.post("/api/phonebook", (request, response) => {
    /* todo los datos enviados en la peticion de tipo POST quedaran almacenados dentro del body, esto se configura
    al usar el express.json de la linea 6, dentro del request.body vendran los datos enviados en la peticion/formulario */
    const body = request.body

    if (!body.name || !body.number) // verificamos si el body viene sin datos
    {
        response.status(204).json({
            error: "Missing information"
        }) // si viene vacio arrojamos un error de que falta informacion
    }
    else { // sino viene vacio seteamos el nuevo contacto
        const contact = {
            id: generatedID(phonebook),
            name: body.name,
            number: body.number
        } // creamos el objeto del contacto
        phonebook = phonebook.concat(contact) // lo guardamos
        response.status(201).json(contact) // retornamos el contacto con un codigo de "creado"
    }
})


// url de la api que elimina un registro de la lista
app.delete("/api/phonebook/:id", (request, response) => {
    const id = Number(request.params.id)// sacamos el id 
    const contact = phonebook.find(contact => contact.id === id) // buscamos el contacto

    if (contact) { // si existe
        phonebook = phonebook.filter(contact => contact.id !== id) // lo eliminamos
        response.status(202).json(contact) // retornamos un codigo de "OK" y retornamos los datos del contacto eliminado
    }
    else { // sino existe
        response.status(404).json({
            error: `contact with id ${id} not found`
        }) // arrojamos un error de not found (404)
    }
})

// url de la api que modifica un registro de la lista
app.put("/api/phonebook/:id", (request, response) => {
    const id = Number(request.params.id) // extraemos el id
    const body = request.body // extraemos los datos nuevos del contacto, como si fuera un post

    const contact = phonebook.find(contact => contact.id === id) // buscamos el contacto

    if (!contact) // si no existe
    {
        response.status(404).json({
            error: `Contact with id ${id} not found`
        }) // arrojamos un error personalizado con codigo 404
    }
    else { // si existe
        contact.name = body.name
        contact.number = body.number // modificamos su nombre y numero
        response.status(201).json(contact) // retornamos el contacto con los nuevos datos con el codigo "201" created ya que se considera un nuevo registro
    }
})

const uknownEndPoint = (request, response) => {
    response.status(404).json({
        error: "Uknown endpoint"
    })
}

app.use(uknownEndPoint)

// puerto donde correra la api (localhost:3001)
PORT = 3001

// creamos el lister que escuchara las peticiones hhtp mandadas a ese puerto
app.listen(PORT, () => {
    console.log(`Running in port ${PORT}`)
})
