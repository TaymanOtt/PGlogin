const { Pool } = require('pg');
const pool = new Pool({
  user: "postgres",
  password: "mercury666",
  database: "test",
  host: "localhost",
  port: "5432"
});

async function sendUser(id, name, email, password){
try{
  const results = await pool.query(`INSERT INTO users (id, name, email, password) VALUES('${id}', '${name}', '${email}', '${password}');`)
 }
    catch(ex){
      console.log(`Something wrong happend ${ex}`)
    }
}

module.exports = sendUser
