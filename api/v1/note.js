'use strict'

const express = require('express')
const router = express.Router()
const NoteService = require('../../lib/service/NoteService/NoteService')
var { Validator, ValidationError } = require('express-json-validator-middleware')

// Initialize a Validator instance first with AJV all errors enabled.
var validator = new Validator({allErrors: true})

// Define a shortcut function.
var validate = validator.validate

//
// Define a JSON Schemas. Could be placed in separate schemas file - more modular design.
//

var uuidPattern = '^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$'

var noteGetSchema = {
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

var notePostSchema = {
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

var notePutSchema = {
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

var noteDeleteSchema = {
    // req.body is of type array and has array objects that contain an id.
    type: 'array',
    items: {
        // Validate id is valid UUIDv4.
        type: 'string',
        pattern: uuidPattern
    }
}

var noteSearchSchema = {
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
    return res.send(JSON.stringify(notes, null, 2))
})

router.get('/', validate({query: noteGetSchema}), (req, res) => {
    var noteId = req.query.id
    var result = NoteService.getNote(noteId)
    if(result === undefined) {
        return res.send(404, `Error: note with id ${noteId} not found. Check your note id and try again.`)
    }
    else {
        return res.send(JSON.stringify(result, null, 2))
    }
})

router.post('/', validate({body: notePostSchema}), (req, res) => {
    var notes = req.body
    var noteIds = NoteService.create(notes)
    return res.send(JSON.stringify(noteIds, null, 2))
})

router.put('/', validate({body: notePutSchema}), (req, res) => {
    var note = req.body
    var stored_note = NoteService.edit(note)
    if(stored_note === undefined) {
        return res.send(404, `Error: note with id ${note.id} not found. Check your note id and try again.`)
    }
    else {
        return res.send(JSON.stringify(stored_note.id, null, 2))
    }
})

router.delete('/', validate({body: noteDeleteSchema}), (req, res) => {
    var noteIds = req.body
    var results = NoteService.remove(noteIds)
    return res.sendStatus(200)
})

router.get('/search', validate({query: noteSearchSchema}), (req, res) => {
    var keywords = req.query.keywords
    var results = NoteService.search(keywords)
    return res.send(results)
})

// Error handler for route validation errors.
router.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
        let msg = {
            "message": "invalid request",
            "error": err.validationErrors
        }
        res.status(400).send(msg)
        next()
    }
    // Pass error on if not a route validation error.
    else next(err) 
})

module.exports = router
