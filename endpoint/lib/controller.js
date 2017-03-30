'use strict';

const moment = require('moment');

// supplied by spec
const QUERY_FIELDS = {
  eventtype: 'eventtype',
  ids: 'ids',
};

const EVENT_TYPES = {
  list: 'list',
  details: 'details',
  conversion: 'conversion',
};

function wrapper(db) {
  function saveData({ eventtype, ids, date }, cb) {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      const stmt = db.prepare("INSERT INTO track VALUES (?, ?, ?)");
      ids.forEach(id => stmt.run(eventtype, id, date));
      stmt.finalize();
      db.run("COMMIT", cb);
    });
  }

  function controller(req, res) {
    // check fields in query string
    if (!(QUERY_FIELDS.eventtype in req.query && QUERY_FIELDS.ids in req.query)) {
      return res.status(400).send('Bad Request');
    }

    // check fields are not empty
    if (req.query.ids.length < 1 || req.query.eventtype.length < 1) {
      return res.status(400).send('Bad Request');
    }

    // extract fields from query string
    const eventtype = req.query.eventtype;
    const ids = req.query.ids.split(',');
    const date = moment().format();

    // check ids are positive integers
    for (const id of ids) {
      if (isNaN(id) || (Number(id) < 0)) {
        return res.status(400).send('Bad Request');
      }
    }

    // insert in database
    if ((eventtype === EVENT_TYPES.details || eventtype === EVENT_TYPES.conversion) &&
        ids.length === 1) {
      saveData({ eventtype, ids, date }, (err) => {
        if (err) res.status(500).send('Internal Server Error');
        else res.json({ OK: ids.length });
      });
    } else if (eventtype === EVENT_TYPES.list && ids.length >= 1) {
      saveData({ eventtype, ids, date }, (err) => {
        if (err) res.status(500).send('Internal Server Error');
        else res.json({ OK: ids.length });
      });
    } else {
      res.status(400).send('Bad Request');
    }
  }

  return controller;
}

module.exports = wrapper;
