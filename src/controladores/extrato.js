const pool = require("../conexao");

const extrato = async (req, res) => {
	try {
		const somaEntrada = await pool.query(
			`
        select sum(valor) as entrada
        from transacoes
        where tipo = 'entrada' and usuario_id = $1`,
			[req.usuario.id]
		);
		const somaSaida = await pool.query(
			`
        select sum(valor) as saida
        from transacoes
        where tipo = 'saida' and usuario_id = $1`,
			[req.usuario.id]
		);
		const resultado = {
			entrada: somaEntrada.rows[0].entrada || 0,
			saida: somaSaida.rows[0].saida || 0,
		};
		return res.json(resultado);
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ mensagem: "Transação não encontrada." });
	}
};

module.exports = {
	extrato,
};
