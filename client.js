const { Client } = require('pg');
const client = new Client({
  user: "postgres",
  password: "mercury666",
  database: "madSpots",
  host: "localhost",
  port: "5432"
});

module.exports = client
