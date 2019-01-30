'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const routes = require('./api/v1')
const port = 8081
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./docs/swagger.yaml')
const config = require('config')
const cors = require("cors")

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api/v1/ping', routes.ping)
app.use('/api/v1/note', routes.note)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send(`Welcome to Jeff's Note Microservice. Database file in use: ${config.lowdb.filename}`)
})

app.listen(port, () => console.log(`Jeff's Note Microservice listening on port ${port}. Database file in use: ${config.lowdb.filename}.`))

// Export for testing purposes.
module.exports = app