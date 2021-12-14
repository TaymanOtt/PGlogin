const { Pool } = require('pg');
const pool = new Pool({
	user: "postgres",
	password: "mercury666",
	database: "test",
	host: "localhost",
	port: "5432"
});

async function followUser.js(username, followUser){
	try{
		const results = await pool.query(`INSERT INTO ${username} (username) VALUES('${followUser}');`);
	}
	catch(ex){
		console.log(`Something wrong happend ${ex}`);
	}
}

module.exports = followUser
