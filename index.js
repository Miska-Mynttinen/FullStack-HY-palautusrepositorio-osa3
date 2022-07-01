const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  },
]

morgan.token('body', function (req, res) {return JSON.stringify(req.body)})

app.use(express.json())
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  response.json(persons)
})


const requestTime = new Date()
const peopleAmount = persons.length
app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${peopleAmount} people</p><p>${requestTime}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateID = Math.floor(Math.random() * 1000000)
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const duplicateName = persons.find(person => person.name === body.name)
  if (typeof duplicateName !== 'undefined') {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  
  const duplicateID = persons.find(person => person.id === generateID)
  if (typeof duplicateID !== 'undefined') {
    return response.status(400).json({
      error: 'id already exists try again with random number generator'
    })
  }

  const person = {
    id: generateID,
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})