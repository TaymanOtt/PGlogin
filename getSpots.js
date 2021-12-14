const { Pool } = require('pg');
const pool = new Pool({
	user:"postgres",
	password: "mercury666",
	database: "test",
	host: "localhost",
	port: "5432"
});
	async function getSpots(username){
	try{
		const response = await pool.query(`SELECT * FROM spots WHERE userName='${username}';`)
		return response.rows;
		console.log(response.rows);
	}	
	catch(ex){
		console.log(`Something went wrong ${ex}`);	
		}
	}
module.exports = getSpots;
