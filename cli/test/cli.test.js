'use strict';

/* global describe, it, before, beforeEach, after */

// load and set env variables
require('dotenv').config({ path: '../.env' });
process.env.NODE_ENV = 'test';

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');
const chai = require('chai');

const { validateInput, getData, convertCsv, exportCsv } = require('../cli.js');

const db = new sqlite3.Database(process.env.DB_HOST);

chai.should();

function cleanExportsFolder(done) {
  const dir = './exports';

  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      fs.unlinkSync(path.join(dir, file));
    }
    done();
  } catch (err) {
    done(err);
  }
}

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

function seedTable(done) {
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    const stmt = db.prepare("INSERT INTO track VALUES (?, ?, ?)");

    for (let i = 31; i >= 1; i--) {
      const day = i < 10 ? `0${i}` : i;
      for (const eventtype of ['list', 'details', 'conversion']) {
        for (let j = 1; j <= 5; j++) {
          stmt.run(eventtype, j, moment(`2017-03-${day}`).format());
        }
      }
    }

    stmt.finalize();
    db.run("COMMIT", (err) => {
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

describe('CLT', () => {
  after(cleanExportsFolder);
  after(cleanTable);
  after(closeDbConnection);

  describe('validateInput', () => {
    it('should resolve no arg', (done) => {
      validateInput()
        .then((args) => {
          args.date.format('YYYY-MM-DD').should.equal(moment().format('YYYY-MM-DD'));
          done();
        })
        .catch(reason => done(reason));
    });
    it('should resolve empty arg', (done) => {
      validateInput({})
        .then((args) => {
          args.date.format('YYYY-MM-DD').should.equal(moment().format('YYYY-MM-DD'));
          done();
        })
        .catch(reason => done(reason));
    });
    it('should resolve YYYY-MM-DD', (done) => {
      validateInput({ input: '1989-04-16' })
        .then((args) => {
          args.date.format('YYYY-MM-DD').should.equal('1989-04-16');
          done();
        })
        .catch(reason => done(reason));
    });
    it('should reject invalid day YYYY-MM-DD', (done) => {
      validateInput({ input: '1989-04-50' }).catch(() => done());
    });
    it('should reject invalid month YYYY-MM-DD', (done) => {
      validateInput({ input: '1989-50-16' }).catch(() => done());
    });
    it('should reject DD-MM-YYYY', (done) => {
      validateInput({ input: '16-04-1989' }).catch(() => done());
    });
    it('should reject MM-DD-YYYY', (done) => {
      validateInput({ input: '04-16-1989' }).catch(() => done());
    });
    it('should reject random strings', (done) => {
      validateInput({ input: 'qwerty' }).catch(() => done());
    });
    it('should reject random ints', (done) => {
      validateInput({ input: 123456 }).catch(() => done());
    });
  });

  describe('getData', () => {
    before(cleanTable);
    before(seedTable);
    after(cleanTable);

    it('should reject no args', (done) => {
      getData().catch(() => done());
    });
    it('should reject empty args', (done) => {
      getData({}).catch(() => done());
    });
    it('should resolve YYYY-MM-DD', (done) => {
      getData({ date: moment('2017-03-29') })
        .then((args) => {
          args.data.should.be.instanceof(Array);
          done();
        })
        .catch(reason => done(reason));
    });
    it('should resolve correct data', (done) => {
      getData({ date: moment('2017-03-29') })
        .then((args) => {
          args.data.should.have.length(5);
          args.data.find(row => row.ID === 1)['#List Impressions'].should.equal(1);
          args.data.find(row => row.ID === 1)['#Details Views'].should.equal(1);
          args.data.find(row => row.ID === 1)['#Conversions'].should.equal(1);
          args.data.find(row => row.ID === 1)['Click Rate 7 Days'].should.equal(100);
          args.data.find(row => row.ID === 1)['Conversion Rate 7 Days'].should.equal(50);
          args.data.find(row => row.ID === 1)['Conversion Rate 14 Days'].should.equal(50);
          done();
        })
        .catch(reason => done(reason));
    });
  });

  describe('convertCsv', () => {
    it('should reject no args', (done) => {
      convertCsv().catch(() => done());
    });
    it('should reject empty args', (done) => {
      convertCsv({}).catch(() => done());
    });
    it('should resolve correct args', (done) => {
      const data = [
        { ID: 1,
          '#List Impressions': 1,
          '#Details Views': 1,
          '#Conversions': 1,
          'Click Rate 7 Days': 100,
          'Conversion Rate 7 Days': 50,
          'Conversion Rate 14 Days': 50 },
        { ID: 2,
          '#List Impressions': 1,
          '#Details Views': 1,
          '#Conversions': 1,
          'Click Rate 7 Days': 100,
          'Conversion Rate 7 Days': 50,
          'Conversion Rate 14 Days': 50 }];
      convertCsv({ data })
        .then((args) => {
          args.csv.should.equal(
            '"ID","#List Impressions","#Details Views","#Conversions","Click Rate 7 Days",' +
            '"Conversion Rate 7 Days","Conversion Rate 14 Days"\n' +
            '1,1,1,1,100,50,50\n' +
            '2,1,1,1,100,50,50');
          done();
        })
        .catch(reason => done(reason));
    });
  });

  describe('exportCsv', () => {
    beforeEach(cleanExportsFolder);
    after(cleanExportsFolder);

    it('should reject no args', (done) => {
      exportCsv().catch(() => done());
    });
    it('should reject empty args', (done) => {
      exportCsv({}).catch(() => done());
    });
    it('should create a new file', (done) => {
      const date = moment('1989-04-16').format('YYYY-MM-DD');
      const csv = '"ID","#List Impressions","#Details Views","#Conversions","Click Rate 7 Days",' +
        '"Conversion Rate 7 Days","Conversion Rate 14 Days"\n' +
        '1,1,1,1,100,50,50\n' +
        '2,1,1,1,100,50,50';
      exportCsv({ date, csv })
      .then(() => {
        fs.readdir('./exports', (err, files) => {
          if (err) return done(err);
          files.should.have.length(1);
          done();
        });
      })
      .catch(reason => done(reason));
    });
  });
});
