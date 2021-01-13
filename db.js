const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "mercury666",
    database: "postgres"
    host: "localhost",
    port: "5432"
});

module.exports = pool;
