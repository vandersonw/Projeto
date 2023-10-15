 const express = require('express');
 const conta = require('./controladores/contasBancarias');
 const transacao = require('./controladores/transacao');
 
 const rotas = express();

 rotas.get('/contas', conta.listar)
 rotas.post('/contas', conta.criarContaBancaria)
 rotas.put('/contas/:numeroConta/usuario', conta.atualizarUsuarioDaConta)
 rotas.delete('/contas/:numeroConta', conta.excluirUmaConta)
 
 rotas.post('/transacoes/depositar', transacao.depositarNaConta)
 rotas.post('/transacoes/sacar', transacao.sacar)
 rotas.post('/transacoes/transferir', transacao.transferir)
 rotas.get('/contas/saldo', transacao.conferirSaldo)
 rotas.get('/contas/extrato', transacao.conferirExtrato)

 module.exports = rotas;