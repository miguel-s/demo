'use strict';

// load and set env variables
require('dotenv').config({ path: '../.env' });

// load external dependencies
const express = require('express');
const app = express();

// load internal dependencies
const db = require('./lib/db.js');
const controller = require('./lib/controller.js')(db);

// define routes
app.get('/track', controller);
app.get('*', (req, res) => res.status(404).send('Not found'));

// define port and start app server
const port = process.env.PORT || 8081;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  app.listen(port, () => console.log(`App listening on port ${port}`));
}

// export for testing with mocha
module.exports = app;
