const { Pool } = require('pg');
const pool = new Pool({
	user:"postgres",
	password: "password",
	database: "test",
	host: "localhost",
	port: "5432"
});

	async function addSpot(userName, spotName, longitude, latitude){
	try{
		const response = await pool.query(`INSERT INTO spots (userName, spotName, longitude, latitude) VALUES ('${userName}', '${spotName}', ${longitude}, ${latitude});`)
	}
	catch(ex){
		console.log(`Something wrong happened ${ex}`)
	}
	}

module.exports = addSpot
