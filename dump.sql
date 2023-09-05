-- Active: 1692046027675@@127.0.0.1@5432@dindin
CREATE DATABASE dindin;

CREATE TABLE usuarios (id serial primary key, nome varchar(100) not null, email text unique not null, senha text not null);

CREATE TABLE categorias (id serial primary key, descricao text not null);

CREATE TABLE transacoes (
    id serial primary key, 
    descricao text, 
    valor INTEGER not null, 
    data TIMESTAMP, 
    categoria_id INTEGER not null REFERENCES categorias(id),
    usuario_id INTEGER not null REFERENCES usuarios(id),
    tipo varchar(20) not null
    );

insert into categorias (descricao) 
VALUES 
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'), 
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');

