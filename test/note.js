process.env.NODE_ENV = 'test'

const fs = require('fs-extra')
const util = require('util')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const FileAsync = require('lowdb/adapters/FileAsync')
const config = require('config')
var server

//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()

chai.use(chaiHttp)

describe('Notes', () => {
    before((done) => {
        let databaseFilename = __dirname + '/data/testdb.json'
        fs.remove(databaseFilename, err => {
            if(err) {
                return console.log(err)
            }
            // Initialize new database with a single note.
            const adapter = new FileSync(databaseFilename)
            const db = low(adapter)
            db.defaults({ notes: [{"body": "this is a mocha test.", "id": "76f8faac-11af-4a1b-a804-edb367f4aa54"}]}).write()
            server = require('../index')
            done()
        })
    })

    describe('/api/v1/note/get/all', () => {
        it('it should GET all the notes', (done) => {
            chai.request(server)
                .get('/api/v1/note/all')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.should.be.json
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(1)
                    return done()
                })
        })
    })

    describe('/api/v1/note/get', () => {
        it('it should GET a note', (done) => {
            chai.request(server)
                .get('/api/v1/note?id=76f8faac-11af-4a1b-a804-edb367f4aa54')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.should.be.json
                    res.body.should.be.a('object')
                    res.body.should.have.property('id').eql('76f8faac-11af-4a1b-a804-edb367f4aa54')
                    res.body.should.have.property('body').eql('this is a mocha test.')
                    return done()
                })
        })
    })

    describe('/api/v1/note', () => {
        it('it should POST a note', (done) => {
            chai.request(server)
                .post('/api/v1/note')
                .set('content-type', 'application/json')
                .send([{"body": "this is a post mocha test."}])
                .end((err, res) => {
                    res.should.have.status(200)
                    res.should.be.json
                    res.body.should.be.a('array')
                    return done()
                })
        })
    })

    after((done) => {
        let databaseFilename = __dirname + '/data/testdb.json'
        fs.remove(databaseFilename, err => {
            if(err) {
                return console.log(err)
            }
            done()
        })
    })

    //////////////////////////////////////////////////////////////////////////////////////
    // Should add many more tests here to test out (in)valid input data for all routes. //
    //////////////////////////////////////////////////////////////////////////////////////
})