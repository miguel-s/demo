# Demo #

## Dependencies
* Node.js (developed and tested on v7.7.4)

---

## Environment Variables
Environment variables are written in the .env file.
* NODE_ENV -> set environment, options: "production", "development", "test"
* PORT -> port for the Express server, default: 8081
* DB_HOST -> location of the SQLite3 database file

---

## Endpoint
http://HOST:PORT/track?eventtype=EVENT_TYPE_VALUE&ids=COMMA_SEPARATED_LIST_OF_IDS

### Technologies
* Server: Node.js
* Framework: Express
* Database: SQLite3
* Testing:
    * Framework: Mocha
    * Assertion library: Chai
* Stress testing: Artillery

### Commands
* npm install -> install nodejs dependencies
* npm test -> run tests
* npm start -> start the server
* npm run dev -> start server with file watcher
* npm run seed -> seed the database with randomly generated data
* npm run stress -> run stress test, server needs to be running

---

## CLI
Exports tracking data to the ./exports directory in csv format.

### Technologies
* Server: Node.js
* Database: SQLite3
* Testing:
    * Framework: Mocha
    * Assertion library: Chai

### Commands
* npm install -> install nodejs dependencies
* npm test -> run tests
* ./cli.js -> run cli without arguments
* ./cli.js -d YYYY-MM-DD -> run cli with date argument

---

## Considerations
For purpose of simplicity and speed of development I used a SQLite3 database in this demo, this naturally limits this implementation to running on a single machine. In a real development situation I would have opted for a separate database server running SQL Server (if licence permits), PostgreSQL or MySQL. This demo can be easily adapted to connect to a database server, allowing it to be deployed on multiple machines.

---

Miguel Serrano
<br />
30-03-2017