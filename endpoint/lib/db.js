'use strict';

let sqlite3;
if (process.env.NODE_ENV === 'production') {
  sqlite3 = require('sqlite3');
} else {
  sqlite3 = require('sqlite3').verbose();
}

const db = new sqlite3.Database(process.env.DB_HOST);
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS track (eventtype TEXT, id INT, inserted_at DATETIME)");
});

module.exports = db;
