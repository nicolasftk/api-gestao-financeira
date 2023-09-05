const pool = require("../conexao");

const validarEmail = async (req, res, next) => {
	const { email } = req.body;
	const encontrarUsuario = await pool.query("select * from usuarios where email = $1", [email]);
	req.validarEmail = encontrarUsuario.rowCount === 0 ? null : encontrarUsuario.rows[0];

	next();
};

module.exports = {
	validarEmail,
};
