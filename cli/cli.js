#!/usr/bin/env Node

'use strict';

/* eslint-disable no-console */

require('dotenv').config({ path: '../.env' });

const fs = require('fs');
const program = require('commander');
const moment = require('moment');
const json2csv = require('json2csv');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(process.env.DB_HOST);
const query = fs.readFileSync('./query.sql').toString();

program
  .version('1.0.0')
  .option('-d, --date [date]', 'specify upper bound date (YYYY-MM-DD), default today')
  .parse(process.argv);

function logMessage(message) {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    console.log(message);
  }
}

function validateInput(args = {}) {
  logMessage('Validating input...');

  return new Promise((resolve, reject) => {
    if (args &&
        args.input &&
        !(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/.test(args.input) &&
        moment(args.input, 'YYYY-MM-DD').isValid())) {
      reject('Invalid date (YYYY-MM-DD).');
    } else {
      const date = moment(args.input).startOf('day');
      resolve(Object.assign({}, args, { date }));
    }
  });
}

function getData(args = {}) {
  logMessage('Getting data...');

  return new Promise((resolve, reject) => {
    if (!args.date) reject('Error missing date.');

    db.all(query,
      {
        $date: moment(args.date).format(),
        $dateMinusOneDay: moment(args.date).subtract(1, 'day').format(),
        $dateMinusOneWeek: moment(args.date).subtract(7, 'day').format(),
        $dateMinusTwoWeeks: moment(args.date).subtract(14, 'day').format(),
      },
      (err, rows) => {
        if (err) reject('Error reading database.');
        resolve(Object.assign({}, args, { data: rows }));
      }
    );
  });
}

function convertCsv(args = {}) {
  logMessage('Converting CSV...');

  return new Promise((resolve, reject) => {
    if (!args.data) reject('Error missing data.');
    if (!Array.isArray(args.data)) reject('Error reading data.');
    if (args.data.length < 1) reject('Error no data found.');

    json2csv({ data: args.data }, (err, csv) => {
      if (err) reject('Error parsing data.');
      resolve(Object.assign({}, args, { csv }));
    });
  });
}

function exportCsv(args = {}) {
  logMessage('Exporting CSV...');

  const dir = './exports';
  const filename = `export_track_${moment(args.date).format('YYYY-MM-DD')}.csv`;
  const filepath = `${dir}/${filename}`;

  return new Promise((resolve, reject) => {
    if (!args.date) reject('Error missing date.');
    if (!args.csv) reject('Error missing csv.');

    fs.mkdir(dir, (err) => {
      if (err.code !== 'EEXIST') reject('Error creating exports directory.');
      fs.writeFile(filepath, args.csv, (err) => {
        if (err) reject('Error writing file.');
        logMessage(`File ${filename} successfully written!`);
        resolve(args);
      });
    });
  });
}

// run cli
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  Promise
    .resolve({ input: program.date })
    .then(validateInput)
    .then(getData)
    .then(convertCsv)
    .then(exportCsv)
    .then(() => process.exit(0))
    .catch((reason) => {
      console.error(reason);
      process.exit(1);
    });
}

// export for testing with mocha
module.exports = { validateInput, getData, convertCsv, exportCsv };
