'use strict'

const express = require('express')
const router = express.Router()
const NoteService = require('../../lib/service/NoteService/NoteService')
const { Validator, ValidationError } = require('express-json-validator-middleware')

// Initialize a Validator instance first with AJV all errors enabled.
let validator = new Validator({allErrors: true})

// Define a shortcut function.
let validate = validator.validate

//
// Define a JSON Schemas. Could be placed in separate schemas file - more modular design.
//

let uuidPattern = '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$'

let noteGetSchema = {
    // req.query is of type object and has a required id property.
    type: 'object',
    required: ['id'],
    properties: {
        id: { 
            // Validate id is valid UUIDv4.
            type: 'string',
            pattern: uuidPattern
        }
    }
}

let notePostSchema = {
    // req.body is of type array and has array objects that contain a body.
    type: 'array',
    items: {
        type: 'object',
        required: ['body'],
        properties: {
            body: {
                type: 'string'
            }
        }
    }
}

let notePutSchema = {
    // req.body is of type array and has array objects that contain an id and body.
    type: 'object',
    required: ['id', 'body'],
    properties: {
        id: {
            // Validate id is valid UUIDv4.
            type: 'string',
            pattern: uuidPattern
        },
        body: {
            type: 'string'
        }
    }
}

let noteDeleteSchema = {
    // req.body is of type array and has array objects that contain an id.
    type: 'array',
    items: {
        // Validate id is valid UUIDv4.
        type: 'string',
        pattern: uuidPattern
    }
}

let noteSearchSchema = {
    // req.body is of type array and has array objects that contain an id.
    type: 'object',
    required: ['keywords'],
    properties: {
        keywords: {
            type: 'string'
        }
    }
}

router.get('/all', (req, res) => {
    let notes = NoteService.getAll()
    res.setHeader('Content-Type', 'application/json')
    return res.send(notes, null, 2)
})

router.get('/', validate({query: noteGetSchema}), (req, res) => {
    let noteId = req.query.id
    let result = NoteService.getNote(noteId)
    res.setHeader('Content-Type', 'application/json')
    if(result === undefined) {
        return res.status(404).send(JSON.stringify({'error': `note with id ${noteId} not found. Check your note id and try again.`}))
    }
    else {
        return res.send(JSON.stringify(result, null, 2))
    }
})

router.post('/', validate({body: notePostSchema}), (req, res) => {
    let notes = req.body
    let noteIds = NoteService.create(notes)
    res.setHeader('Content-Type', 'application/json')
    return res.send(JSON.stringify(noteIds, null, 2))
})

router.put('/', validate({body: notePutSchema}), (req, res) => {
    let note = req.body
    let stored_note = NoteService.edit(note)
    res.setHeader('Content-Type', 'application/json')
    if(stored_note === undefined) {
        return res.status(404).send(JSON.stringify({'error': `note with id ${note.id} not found. Check your note id and try again.`}))
    }
    else {
        return res.send(JSON.stringify(stored_note.id, null, 2))
    }
})

router.delete('/', validate({body: noteDeleteSchema}), (req, res) => {
    let noteIds = req.body
    let results = NoteService.remove(noteIds)
    res.setHeader('Content-Type', 'application/json')
    return res.sendStatus(200)
})

router.get('/search', validate({query: noteSearchSchema}), (req, res) => {
    let keywords = req.query.keywords
    let results = NoteService.search(keywords)
    res.setHeader('Content-Type', 'application/json')
    return res.send(results)
})

// Error handler for route validation errors.
router.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
        let msg = {
            "message": "invalid request",
            "error": err.validationErrors
        }
        res.setHeader('Content-Type', 'application/json')
        res.status(400).send(JSON.stringify(msg))
        next()
    }
    // Pass error on if not a route validation error.
    else next(err) 
})

module.exports = router
