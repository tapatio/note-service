# Jeff's Note Service

## How-to run

1. git clone https://github.com/tapatio/note-service.git
2. npm update
3. npm install
4. node index.js
5. open your browser and navigate to localhost:3000/api-docs

## Specifications

The service provides the following features:
1. Route to verify service is up.
2. Route that returns all notes.
3. Route that returns a note given it's id.
4. Route to add one or more notes.
5. Route to edit a note.
6. Route to delete one or more notes.
7. Route to search for notes given keywords.
8. Note storage using lowdb.
9. Route validation.

## Route Table

### Base route: localhost:3000/api/v1

| HTTP      | Route             | Query Parameters           | Path Parameters           | Body Payload          | Return Values                                                              |
| ----------|-------------------|----------------------------|---------------------------|-----------------------|----------------------------------------------------------------------------|
| GET       | /ping             | None                       | None                      | None                  | Returns 200 with text "Success". Quick check to see if service is running. |
| GET       | /note/all         | None                       | None                      | None                  | Returns 200 with JSON array of all notes currently stored.                 |
| GET       | /note             | id=NoteId                  | None                      | None                  | Returns 200 with JSON note, 404 if not found.                              |
| POST      | /note             | None                       | None                      | JSON array of notes   | Returns 200 with JSON array of noteIds corresponding to notes stored.      |
| PUT       | /note             | None                       | None                      | JSON note with noteId | Returns 200 with JSON noteId, 404 if note UUID not found.                  |
| delete    | /note             | None                       | None                      | JSON array of noteIds | Returns 200.                                                               |
| GET       | /note/search      | keywords="words to search" | None                      | None                  | Returns 200 with JSON array of notes that contain all of keywords.         |

### Software Versions Used:

1. Node v10.15.0
2. NPM v6.4.1
