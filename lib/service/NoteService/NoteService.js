'use strict'

const config = require('config')
const low = require('lowdb')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(config.get('lowdb.filename'))
const db = low(adapter)
db._.mixin(lodashId)

///////////////////////////////////////////////////////////////
// Note database format.
// let database = {
//     "notes": [
//         { "id": 1, "body": "this is the first note" },
//         { "id": 2, "body": "this is the second note" },
//         { "id": 3, "body": "this is the third note" }
//     ]
// }
///////////////////////////////////////////////////////////////

class NoteService {
    static getAll() {
        return JSON.stringify(db.get('notes'))
    }

    static getNote(noteId) {
        const note = db.get('notes').
            find({id:noteId}).
            value()
        return note
    }

    static create(notes) {
        const collection = db.get('notes')
        var noteIds = notes.map(function(note) {
            const result = collection.insert(note).write()
            return result.id
        })
        return noteIds
    }

    static edit(note) {
        const collection = db.get('notes')
        const result = collection.updateById(note.id, {"body":note.body}).write()
        return result
    }

    static remove(noteIds) {
        const collection = db.get('notes')
        noteIds.map(function(noteId) {
            collection.removeById(noteId).write()
        })
    }

    static search(keywords) {
        let search_terms = keywords.toLowerCase().split(" ")
        const collection = db.get('notes').value()
        let results = []
        collection.map(function(note) {
            let body = note.body
            body = body.toLowerCase()
            let term_count = 0
            search_terms.some(function(term) {
                try {
                    var regex = new RegExp(`\\b${term}\\b`);
                    if(regex.test(body)) {
                        // Term exists in body.
                        term_count += 1
                    }
                } catch(e) {
                    console.log("Invalid keyword specified:", e)
                }
            })
            if(term_count === search_terms.length) {
                // All search terms exist in body so return the note.
                // Could change this to term_count > 0 to return the
                // note if at least one search term exists in the body.
                results.push(note)
            }
        })
        return results
    }
}

module.exports = NoteService
