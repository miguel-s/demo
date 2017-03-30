'use strict';

require('dotenv').config({ path: '../.env' });

const moment = require('moment');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(process.env.DB_HOST);

function getRandomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomEventtype() {
  const eventtypes = ['list', 'details', 'conversion'];
  const index = getRandomIntBetween(0, 3);
  return eventtypes[index];
}

function getRandomId() {
  return getRandomIntBetween(1, 101);
}

function getRandomDate() {
  const now = moment().startOf('day');
  const days = getRandomIntBetween(1, 51);
  return now.subtract(days, 'days').format();
}

db.serialize(() => {
  db.run("BEGIN TRANSACTION");
  db.run("DROP TABLE IF EXISTS track");
  db.run("CREATE TABLE IF NOT EXISTS track (eventtype TEXT, id INT, inserted_at DATETIME)");
  const stmt = db.prepare("INSERT INTO track VALUES (?, ?, ?)");
  for (let i = 0; i < 100000; i++) {
    stmt.run(getRandomEventtype(), getRandomId(), getRandomDate());
  }
  stmt.finalize();
  db.run("COMMIT");
});

db.close(() => console.log('Database table [track] seeded.'));

// export for testing with mocha
module.exports = { getRandomIntBetween, getRandomEventtype, getRandomId, getRandomDate };
