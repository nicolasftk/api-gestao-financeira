const bcrypt = require("bcrypt");
const pool = require("../conexao");
const jwt = require("jsonwebtoken");
const { senhaSegura } = require("../dadosSensiveis");

const cadastrarUsuario = async (req, res) => {
	const { nome, email, senha } = req.body;

	try {
		if (req.validarEmail) {
			return res.status(400).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." });
		}

		const senhaCriptograda = await bcrypt.hash(senha, 10);
		const query = `
	insert into usuarios 
		(nome, email, senha) 
	values ($1, $2, $3)
		returning *`;
		const body = [nome, email, senhaCriptograda];
		const novoUsuario = await pool.query(query, body);
		delete novoUsuario.rows[0].senha;

		return res.status(201).json(novoUsuario.rows[0]);
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ mensagem: "Erro ao criar usuário." });
	}
};

const login = async (req, res) => {
	const { email, senha } = req.body;

	if (!email || !senha) {
		return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
	}
	try {
		if (!req.validarEmail) {
			return res.status(404).json({ mensagem: "Usuário não encontrado." });
		}
		const senhaValida = await bcrypt.compare(senha, req.validarEmail.senha);
		if (!senhaValida) {
			return res.status(401).json({ mensagem: "Email ou senha invalida." });
		}
		const token = jwt.sign({ id: req.validarEmail.id }, senhaSegura, { expiresIn: "3d" });
		delete req.validarEmail.senha;
		return res.json({ usuario: req.validarEmail, token });
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ mensagem: "Erro na autenticação." });
	}
};

const detalharUsuario = async (req, res) => {
	const { id } = req.usuario;

	// if (!id) {
	// 	return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
	// }
	try {
		return res.json(req.usuario);
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ mensagem: "Erro na autenticação." });
	}
};

const editarUsuario = async (req, res) => {
	const { id } = req.usuario;
	const { nome, email, senha } = req.body;
	if (!id) {
		return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
	}

	try {
		const emailDoUsuario = await pool.query(
			`
			select * from usuarios
			where email = $1
			and id != $2`,
			[email, id]
		);
		if (emailDoUsuario.rowCount >= 1) {
			return res.status(400).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." });
		}
		const senhaCriptograda = await bcrypt.hash(senha, 10);
		const atualizarDados = pool.query(
			`
			update	usuarios 
			set 	nome = $1, email = $2, senha = $3
			where 	id = $4`,
			[nome, email, senhaCriptograda, id]
		);
		return res.status(204).send();
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ mensagem: "Erro na atualização cadastral." });
	}
};
module.exports = {
	cadastrarUsuario,
	login,
	detalharUsuario,
	editarUsuario,
};
