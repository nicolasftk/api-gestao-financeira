const pool = require("../conexao");

const cadastrarTransacoes = async (req, res) => {
	const { descricao, valor, data, categoria_id, tipo } = req.body;
	if (!descricao || !valor || !data || !categoria_id || !tipo) {
		return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
	}
	try {
		const categoriaEncontrada = await pool.query("select * from categorias where id = $1", [categoria_id]);
		if (categoriaEncontrada.rowCount === 0) {
			return res.status(404).json({ mensagem: "A categoria informada não foi encontrada." });
		}
		const transacao = await pool.query(
			`
            insert      into transacoes (tipo, descricao, valor, data, categoria_id, usuario_id)
            values      ($1, $2, $3, $4, $5, $6)
            returning   *`,
			[tipo, descricao, valor, data, categoria_id, req.usuario.id]
		);
		const transacaoFormatada = {
			id: transacao.rows[0].id,
			tipo: transacao.rows[0].tipo,
			descricao: transacao.rows[0].descricao,
			valor: transacao.rows[0].valor,
			data: transacao.rows[0].data,
			usuario_id: transacao.rows[0].usuario_id,
			categoria_id: categoriaEncontrada.rows[0].id,
			categoria_nome: categoriaEncontrada.rows[0].descricao,
		};
		return res.status(201).json(transacaoFormatada);
	} catch (error) {
		return res.status(500).json({ mensagem: "Erro ao cadastrar transação." });
	}
};

const listarTransacoes = async (req, res) => {
	const { filtro } = req.query;
	try {
		let consultaSql = `
			select	t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id,
					t.categoria_id, c.descricao as categoria_nome
			from	transacoes as t
			join	categorias as c on t.categoria_id = c.id
			where	t.usuario_id = $1
			`;

		const parametros = [req.usuario.id];
		if (filtro && filtro.length >= 1) {
			consultaSql += ` and lower(c.descricao) in (${filtro.map((filtro, index) => `$${index + 2}`).join(", ")})`;
			parametros.push(...filtro);
		}
		const transacoesUsuario = await pool.query(consultaSql, parametros);
		return res.json(transacoesUsuario.rows);
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ mensagem: "Erro ao listar transações." });
	}
};

const transacaoPorId = async (req, res) => {
	const { id } = req.params;
	try {
		const transacoesUsuario = await pool.query(
			`
			select	t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id,
					t.categoria_id, c.descricao as categoria_nome
			from	transacoes as t
			join	categorias as c on t.categoria_id = c.id
			where	t.id = $1 and t.usuario_id = $2`,
			[id, req.usuario.id]
		);
		if (transacoesUsuario.rowCount < 1) {
			return res.status(404).json({ mensagem: "Transação não encontrada." });
		}
		return res.json(transacoesUsuario.rows[0]);
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ mensagem: "Erro ao listar transações." });
	}
};

const atualizarTransacao = async (req, res) => {
	const { id } = req.params;
	const { descricao, valor, data, categoria_id, tipo } = req.body;
	if (tipo.toLowerCase() !== "entrada" && tipo.toLowerCase() !== "saida") {
		return res.status(400).json({ mensagem: "O tipo deve ser registrado como entrada ou saida." });
	}
	try {
		const encontrarCategoria = await pool.query(
			`
		select * from categorias where id = $1`,
			[categoria_id]
		);
		if (encontrarCategoria.rowCount < 1) {
			return res.status(404).json({ mensagem: "Categoria não encontrada." });
		}
		const atualizarDados = await pool.query(
			`
			update 	transacoes
			set 	descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5
			where 	id = $6 and usuario_id = $7`,
			[descricao, valor, data, categoria_id, tipo, id, req.usuario.id]
		);
		if (atualizarDados.rowCount < 1) {
			return res.status(404).json({ mensagem: "Transação não encontrada." });
		}
		return res.status(204).send();
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ mensagem: "Erro ao atualizar transação." });
	}
};

const deletarTransacao = async (req, res) => {
	const { id } = req.params;
	try {
		const deletarDados = await pool.query(
			`
			delete 	from transacoes
			where 	id = $1 and usuario_id = $2`,
			[id, req.usuario.id]
		);
		if (deletarDados.rowCount < 1) {
			return res.status(404).json({ mensagem: "Transação não encontrada." });
		}
		return res.status(204).send();
	} catch (error) {
		return res.status(500).json({ mensagem: "Erro ao deletar transação." });
	}
};
module.exports = {
	cadastrarTransacoes,
	listarTransacoes,
	transacaoPorId,
	atualizarTransacao,
	deletarTransacao,
};
