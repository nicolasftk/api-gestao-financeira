const validarBody = (req, res, next) => {
	const { nome, email, senha } = req.body;
	if (!nome || !email || !senha) {
		return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
	}
	next();
};

const validarBody2 = (req, res, next) => {
	const { descricao, valor, data, categoria_id, tipo } = req.body;
	if (!descricao || !valor || !data || !categoria_id || !tipo) {
		return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
	}
	next();
};

module.exports = {
	validarBody,
	validarBody2,
};
