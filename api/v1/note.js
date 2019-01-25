'use strict'

const express = require('express')
const router = express.Router()
const NoteService = require('../../lib/service/NoteService/NoteService')

router.get('/all', (req, res) => {
    let notes = NoteService.get_all()
    return res.send(JSON.stringify(notes, null, 2))
})

router.post('/', (req, res) => {
    var notes = req.body
    var noteIds = NoteService.create(notes)
    return res.send(JSON.stringify(noteIds, null, 2))
})

router.put('/', (req, res) => {
    var note = req.body
    var noteId = NoteService.edit(note)
    if(noteId === undefined) {
        return res.send(404, `Error: note with id ${note.id} not found. Check your note id and try again.`)
    }
    else {
        return res.send(JSON.stringify(noteId, null, 2))
    }
})

router.delete('/', (req, res) => {
    var noteIds = req.body
    var results = NoteService.remove(noteIds)
    return res.send(200)
})

router.get('/search', (req, res) => {
    var keywords = req.query.keywords
    var results = NoteService.search(keywords)
    return res.send(results)
})

router.get('/', (req, res) => {
    var noteId = req.query.id
    var result = NoteService.get_note(noteId)
    if(result === undefined) {
        return res.send(404, `Error: note with id ${noteId} not found. Check your note id and try again.`)
    }
    else {
        return res.send(JSON.stringify(result, null, 2))
    }
})

module.exports = router
