const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let persons = [
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

/****************************
 *            GET           *
 ***************************/
// Event handler to handle GET request
app.get('/', (request, response) => {
    response.send('<h1>Hello World!"</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
})

app.get('/api/info', (request, response) => {
    const nbPeople = persons.length;
    const today = new Date();

    response.send(`<p>Phonebook has info for ${nbPeople} people</p> <br> ${today}</br>`)
})

/****************************
 *          POSTS           *
 ***************************/
app.post('/api/persons', (request, response) => {
    const body = request.body

    // Send 400 bad request
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    persons.forEach(person => {
        console.log(person)
        if (person.name === body.name) {
            return response.status(400).json({
                error: 'name already exists in data base!'
            })
        }
    })

    const person = {
        id: generateId(1, 99999),
        name: body.name,
        number: body.number,
    }

    console.log(person)

    persons = persons.concat(person)
    response.json(person)
})

/****************************
 *          DELETE          *
 ***************************/
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
})

/****************************
 *          HELPERS         *
 ***************************/
const generateId = (min, max) => {
    return Math.floor(Math.random() * (max - min +1) + min);
}

const generateRandNbr = () => {

}

/****************************
 *         MIDDLEWARE       *
 ***************************/
morgan.token('host', function(req, res) {
    return req.hostname;
});

/****************************
 *          LISTEN          *
 ***************************/
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
