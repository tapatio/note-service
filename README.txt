     _      __  __ _      _  _     _         ___              _        
  _ | |___ / _|/ _( )___ | \| |___| |_ ___  / __| ___ _ ___ _(_)__ ___ 
 | || / -_)  _|  _|/(_-< | .` / _ \  _/ -_) \__ \/ -_) '_\ V / / _/ -_)
  \__/\___|_| |_|   /__/ |_|\_\___/\__\___| |___/\___|_|  \_/|_\__\___|
                                                                       
# How-to run

1. git clone https://github.com/tapatio/note-service.git
2. create json file: /lib/data/lowdb/lowdb.json
3. put this text into the file above: {"notes": []}
4. npm update
5. npm install
6. node index.js

# Specifications

The service supports the following use cases:
1. Route to verify service is up.
2. Route that returns all notes.
3. Route that returns a note given it's id.
4. Route to add one or more notes.
5. Route to edit a note.
6. Route to delete one or more notes.
7. Route to search for notes given keywords.
8. Notes are persisted across server restarts using lowdb.
9. Route validation is performed.

# Route Table

## Base route: localhost:3000/api/v1

HTTP        Route               Query Parameters            Path Parameters             Body Payload            Return Values
GET         /ping               None                        None                        None                    Returns 200 with text "Success". Quick check to see if service is running.
GET         /note/all           None                        None                        None                    Returns 200 with JSON array of all notes currently stored.
GET         /note               id=NoteId                   None                        None                    Returns 200 with JSON note, 404 if not found.
POST        /note               None                        None                        JSON array of notes     Returns 200 with JSON array of noteIds corresponding to notes stored.
PUT         /note               None                        None                        JSON note with noteId   Returns 200 with JSON noteId, 404 if note UUID not found.
delete      /note               None                        None                        JSON array of noteIds   Returns 200.
GET         /note/search        keywords="words to search"  None                        None                    Returns 200 with JSON array of notes that contain all of keywords.

Software Versions Used:

Node v10.15.0
NPM v6.4.1
