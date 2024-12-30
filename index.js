const express = require('express')
const app = express()
let morgan = require('morgan')
const cors = require('cors')

morgan.token('body', function (req, res) {if (req.method==='POST') return JSON.stringify(req.body)})

app.use(cors())
app.use(express.json())
app.use(morgan(' :method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
  res.redirect("/api/persons")
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const note = persons.find(note => note.id === id)
  if (note) { response.json(note) } else { response.status(404).end() }
})

app.get('/info', (req, res) => {
  population = persons.length 
  time = Date()  
  res.send(
    `<p>Phonebook has info for ${population} people</p>  ${time}`
  )
})

app.post('/api/persons', (request, response) => {

  if (!request.body.number || !request.body.name) {
    return response.status(400).json({
      error: "Number or Name is missing."
    })
  }
  else if ( persons.some(note => request.body.name === note.name) ) {
    return response.status(400).json({
      error: "Name already exists in Phonebook."
    })
  }


  const note = request.body
  note.id = String(Math.random()*10**17)
  
  persons = persons.concat(note)

  response.json(note)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(note => note.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
