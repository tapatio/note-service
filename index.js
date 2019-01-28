'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const routes = require('./api/v1')
const port = 3000
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./docs/swagger.yaml')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api/v1/ping', routes.ping)
app.use('/api/v1/note', routes.note)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send(`Welcome to Jeff's Note Microservice. Local db filename is: ${db}`)
})

app.listen(port, () => console.log(`Jeff's Note Microservice listening on port ${port}!`))
