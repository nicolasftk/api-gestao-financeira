const jwt = require("jsonwebtoken");
const { senhaSegura } = require("../dadosSensiveis");
const pool = require("../conexao");

const autenticarRota = async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(401).json({ mensagem: "Não autorizado." });
	}
	const token = authorization.split(" ")[1];
	try {
		const { id } = await jwt.verify(token, senhaSegura);
		const { rows, rowCount } = await pool.query("select * from usuarios where id = $1", [id]);
		if (rowCount === 0) {
			return res.status(401).json({ mensagem: "Não autorizado." });
		}
		req.usuario = rows[0];
		delete req.usuario.senha;
		next();
	} catch (error) {
		return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
	}
};

module.exports = {
	autenticarRota,
};
