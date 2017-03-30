'use strict';

/* global describe, it, before, beforeEach, after */

// load and set env variables
require('dotenv').config({ path: '../.env' });
process.env.NODE_ENV = 'test';

const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../server.js');

const db = new sqlite3.Database(process.env.DB_HOST);

chai.should();
chai.use(chaiHttp);

function cleanTable(done) {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS track");
    db.run("CREATE TABLE IF NOT EXISTS track (eventtype TEXT, id INT, inserted_at DATETIME)",
    (err) => {
      if (err) return done(err);
      done();
    });
  });
}

function closeDbConnection(done) {
  db.close((err) => {
    if (err) return done(err);
    done();
  });
}

describe('Server', () => {
  beforeEach(done => cleanTable(done));
  after(done => cleanTable(done));
  after(done => closeDbConnection(done));

  describe('/track', () => {
    // no querystring
    describe('?', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });

    // eventtype empty
    describe('?eventtype=', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=&ids=', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=&ids=').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=&ids=').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=&ids=1', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=&ids=1').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=&ids=1').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=&ids=1,2,3', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=&ids=1,2,3').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=&ids=1,2,3').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=&ids=-1', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=&ids=-1').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=&ids=-1').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=&ids=-1,-2,-3', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=&ids=-1,-2,.3').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=&ids=-1,-2,.3').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=&ids=a', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=&ids=a').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=&ids=a').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=&ids=a,b,c', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=&ids=a,b,c').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=&ids=a,b,c').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });

    // eventtype list
    describe('?eventtype=list', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=list').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=list').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=list&ids=', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=list&ids=').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=list&ids=').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=list&ids=1', () => {
      describe('GET', () => {
        it('should return 200 ok', (done) => {
          chai.request(server).get('/track?eventtype=list&ids=1').end((err, res) => {
            res.should.have.status(200);
            done();
          });
        });
        it('should have inserted 1 row', (done) => {
          chai.request(server).get('/track?eventtype=list&ids=1').end((err, res) => {
            db.all("SELECT * FROM track", (err, rows) => {
              if (err) return done(err);
              rows.should.have.length(1);
              done();
            });
          });
        });
        it('should have inserted correct data', (done) => {
          chai.request(server).get('/track?eventtype=list&ids=1').end((err, res) => {
            db.all("SELECT * FROM track", (err, rows) => {
              if (err) return done(err);
              for (let i = 0; i < rows.length; i++) {
                rows[i].eventtype.should.equal('list');
                rows[i].id.should.equal(i + 1);
                moment(rows[i].inserted_at).isValid().should.equal(true);
              }
              done();
            });
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=list&ids=1').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=list&ids=1,2,3', () => {
      describe('GET', () => {
        it('should return 200 ok', (done) => {
          chai.request(server).get('/track?eventtype=list&ids=1,2,3').end((err, res) => {
            res.should.have.status(200);
            done();
          });
        });
        it('should have inserted 3 rows', (done) => {
          chai.request(server).get('/track?eventtype=list&ids=1,2,3').end((err, res) => {
            db.all("SELECT * FROM track", (err, rows) => {
              if (err) return done(err);
              rows.should.have.length(3);
              done();
            });
          });
        });
        it('should have inserted correct data', (done) => {
          chai.request(server).get('/track?eventtype=list&ids=1,2,3').end((err, res) => {
            db.all("SELECT * FROM track", (err, rows) => {
              if (err) return done(err);
              for (let i = 0; i < rows.length; i++) {
                rows[i].eventtype.should.equal('list');
                rows[i].id.should.equal(i + 1);
                moment(rows[i].inserted_at).isValid().should.equal(true);
              }
              done();
            });
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=list&ids=1,2,3').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=list&ids=-1', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=list&ids=-1').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=list&ids=-1').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=list&ids=-1,-2,-3', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=list&ids=-1,-2,-3').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=list&ids=-1,-2,-3').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=list&ids=a', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=list&ids=a').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=list&ids=a').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=list&ids=a,b,c', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=list&ids=a,b,c').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=list&ids=a,b,c').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });

    // eventtype details
    describe('?eventtype=details', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=details').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=details').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=details&ids=', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=details&ids=').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=details&ids=').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=details&ids=1', () => {
      describe('GET', () => {
        it('should return 200 ok', (done) => {
          chai.request(server).get('/track?eventtype=details&ids=1').end((err, res) => {
            res.should.have.status(200);
            done();
          });
        });
        it('should have inserted 1 row', (done) => {
          chai.request(server).get('/track?eventtype=details&ids=1').end((err, res) => {
            db.all("SELECT * FROM track", (err, rows) => {
              if (err) return done(err);
              rows.should.have.length(1);
              done();
            });
          });
        });
        it('should have inserted correct data', (done) => {
          chai.request(server).get('/track?eventtype=details&ids=1').end((err, res) => {
            db.all("SELECT * FROM track", (err, rows) => {
              if (err) return done(err);
              for (let i = 0; i < rows.length; i++) {
                rows[i].eventtype.should.equal('details');
                rows[i].id.should.equal(i + 1);
                moment(rows[i].inserted_at).isValid().should.equal(true);
              }
              done();
            });
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=details&ids=1').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=details&ids=1,2,3', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=details&ids=1,2,3').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=details&ids=1,2,3').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=details&ids=-1', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=details&ids=-1').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=details&ids=-1').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=details&ids=-1,-2,-3', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=details&ids=-1,-2,-3').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=details&ids=-1,-2,-3').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=details&ids=a', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=details&ids=a').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=details&ids=a').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=details&ids=a,b,c', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=details&ids=a,b,c').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=details&ids=a,b,c').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });

      // eventtype conversion
    describe('?eventtype=conversion', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=conversion').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=conversion').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=conversion&ids=', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=conversion&ids=').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=conversion&ids=').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=conversion&ids=1', () => {
      describe('GET', () => {
        it('should return 200 ok', (done) => {
          chai.request(server).get('/track?eventtype=conversion&ids=1').end((err, res) => {
            res.should.have.status(200);
            done();
          });
        });
        it('should have inserted 1 row', (done) => {
          chai.request(server).get('/track?eventtype=conversion&ids=1').end((err, res) => {
            db.all("SELECT * FROM track", (err, rows) => {
              if (err) return done(err);
              rows.should.have.length(1);
              done();
            });
          });
        });
        it('should have inserted correct data', (done) => {
          chai.request(server).get('/track?eventtype=conversion&ids=1').end((err, res) => {
            db.all("SELECT * FROM track", (err, rows) => {
              if (err) return done(err);
              for (let i = 0; i < rows.length; i++) {
                rows[i].eventtype.should.equal('conversion');
                rows[i].id.should.equal(i + 1);
                moment(rows[i].inserted_at).isValid().should.equal(true);
              }
              done();
            });
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=conversion&ids=1').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=conversion&ids=1,2,3', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=conversion&ids=1,2,3').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=conversion&ids=1,2,3').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=conversion&ids=-1', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=conversion&ids=-1').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=conversion&ids=-1').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=conversion&ids=-1,-2,-3', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=conversion&ids=-1,-2,-3').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=conversion&ids=-1,-2,-3').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=conversion&ids=a', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=conversion&ids=a').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=conversion&ids=a').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=conversion&ids=a,b,c', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=conversion&ids=a,b,c').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=conversion&ids=a,b,c').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });

    // eventtype other
    describe('?eventtype=other', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=other').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=other').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=other&ids=', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=other&ids=').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=other&ids=').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=other&ids=1', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=other&ids=1').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=other&ids=1').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=other&ids=1,2,3', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=other&ids=1,2,3').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=other&ids=1,2,3').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=other&ids=-1', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=other&ids=-1').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=other&ids=-1').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=other&ids=-1,-2,-3', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=other&ids=-1,-2,-3').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=other&ids=-1,-2,-3').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=other&ids=a', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=other&ids=a').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=other&ids=a').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
    describe('?eventtype=other&ids=a,b,c', () => {
      describe('GET', () => {
        it('should return 400 bad request', (done) => {
          chai.request(server).get('/track?eventtype=other&ids=a,b,c').end((err, res) => {
            res.should.have.status(400);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/track?eventtype=other&ids=a,b,c').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
  });

  // other routes
  describe('all other routes', () => {
    // route index
    describe('/', () => {
      describe('GET', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).get('/').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });

    // route /other
    describe('/other', () => {
      describe('GET', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).get('/other').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
      describe('POST', () => {
        it('should return 404 not found', (done) => {
          chai.request(server).post('/other').end((err, res) => {
            res.should.have.status(404);
            done();
          });
        });
      });
    });
  });
});
