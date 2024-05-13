const { Pool } = require('pg')
const pool = new Pool({
  user: "postgres",
  password: "password",
  database: "test",
  host: "localhost",
  port: "5432"
})

async function getUsers(){
try{
  const response = await pool.query("SELECT * FROM users;")
    return response.rows;
}
catch(ex){
    console.log(`Something wrong happened ${ex}`)
}

}

module.exports = getUsers
