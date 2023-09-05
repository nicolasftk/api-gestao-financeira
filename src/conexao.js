const { Pool } = require("pg");
const { senha, porta } = require("./dadosSensiveis.js");

const pool = new Pool({
	host: "localhost",
	port: porta,
	user: "postgres",
	password: senha,
	database: "dindin",
});

module.exports = pool;
