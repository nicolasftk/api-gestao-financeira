const pool = require("../conexao");

const listarCategoria = async (req, res) => {
	try {
		const listaCategoria = await pool.query("select * from categorias");
		return res.json(listaCategoria.rows);
	} catch (error) {
		return res.status(500).json({ mensagem: "Erro ao requisitar a lista." });
	}
};

module.exports = {
	listarCategoria,
};
