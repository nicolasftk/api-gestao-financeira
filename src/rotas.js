const express = require("express");
const { cadastrarUsuario, login, detalharUsuario, editarUsuario } = require("./controladores/usuarios");
const { autenticarRota } = require("./intermediarios/autenticador");
const { validarEmail } = require("./intermediarios/funcoesQuery");
const { validarBody, validarBody2 } = require("./intermediarios/validacoes");
const { listarCategoria } = require("./controladores/categoria");
const { cadastrarTransacoes, listarTransacoes, transacaoPorId, atualizarTransacao } = require("./controladores/transacoes");

const rotas = express();

rotas.post("/usuario", validarBody, validarEmail, cadastrarUsuario);
rotas.post("/login", validarEmail, login);

rotas.use(autenticarRota);
rotas.get("/usuario", detalharUsuario);
rotas.put("/usuario", validarBody, validarEmail, editarUsuario);
rotas.get("/categoria", listarCategoria);
rotas.post("/transacao", cadastrarTransacoes);
rotas.get("/transacao", listarTransacoes);
rotas.get("/transacao/:id", transacaoPorId);
rotas.put("/transacao/:id", validarBody2, atualizarTransacao);

module.exports = rotas;
