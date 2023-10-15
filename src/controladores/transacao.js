 const {format} = require('date-fns');
 let {contas,saques, depositos, transferencias } = require ('../bancodedados');
 // função para formata no horário da transação
 const dataTransacoes = ()=>{
    const dataAtual = new Date();
    return formatar = format(dataAtual, 'dd/MM/yyyy HH:mm:ss');
 }
 
 const depositarNaConta = (req, res)=>{
    const {numero_conta, valor} = req.body;
    //Não permitir depósitos com valores negativos ou zerados
    if(valor <= 0){
        return res.status(400).json({mensagem:'Não é permitido depósito na conta valores negativo ou zerado!'})
    }
    //Verificar se o numero da conta e o valor do deposito foram informados no body
    if(!numero_conta || !valor){
        return res.status(404).json({mensagem:'O número da conta e o valor são obrigatórios!'})
    }

    //Verificar se a conta bancária informada existe
    const conta = contas.find((conta)=>{
        return conta.numero === Number(numero_conta);
    });
    if(!conta){
        return res.status(404).json({mensagem:'O numero da conta passado não existe'})  
    }
    conta.saldo += valor;
    const registroDeposito = {
        data: dataTransacoes(),
        numero_conta,
        valor,
    }
    depositos.push(registroDeposito);
    return res.status(201).json();
 };
 const sacar = (req, res)=>{
    const {numero_conta, valor, senha} = req.body;
    //Verificar se o numero da conta, o valor do saque e a senha foram informados no body
    if(!numero_conta || !valor || !senha){
        return res.status(400).json({mensagem:'O número da conta, valor e a senha são obrigatórios!'}) 
    }
    //Verificar se a conta bancária informada existe
    const conta = contas.find((conta)=>{
        return conta.numero === Number(numero_conta);
    });
    if(!conta){
        return res.status(404).json({mensagem:'O numero da conta passado não existe'})  
    }
    //Verificar se a senha informada é uma senha válida para a conta informada
    if(conta.usuario.senha !== senha){
        return res.status(403).json({mensagem:'Senha inválida para a conta informada'})  
    }
    //Verificar se há saldo disponível para saque
    if(conta.saldo < valor){
        return res.status(400).json({mensagem:'O valor não pode ser menor que zero!'})  
    }
    //Subtrair o valor sacado do saldo da conta encontrada
    conta.saldo -= valor;
    const registroSaque = {
        data: dataTransacoes(),
        numero_conta,
        valor
    }
    saques.push(registroSaque);
    return res.status(201).json();
 }
 const transferir = (req, res)=>{
    const {numero_conta_origem, numero_conta_destino, valor, senha} = req.body;
    //verificar se todos os campos foram informa
    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha){
        return res.status(400).json({mensagem:'Todos os campos são obrigatório informa!'})
    }
    //Verificar se a conta bancária de origem informada existe
    const contaOrigem = contas.find((conta)=>{
        return conta.numero === Number(numero_conta_origem);
    });
    const contaDestino = contas.find((conta)=>{
        return conta.numero === Number(numero_conta_destino);
    });
    if(!contaOrigem || !contaDestino){
        return res.status(403).json({mensagem:'O numero da conta de origem ou numero conta destino passado não existe'})  
    }
    //Verificar se a senha informada é uma senha válida para a conta de origem informada
     if(contaOrigem.usuario.senha !== senha){
        return res.status(403).json({mensagem: "A senha da conta informada é inválida!"});
     }
    //Verificar se há saldo disponível na conta de origem para a transferência
    if(contaOrigem.saldo < valor){
        return res.status(400).json({mensagem:'Saldo insuficiente!'})
    }
    //Subtrair o valor da transfência do saldo na conta de origem
    contaOrigem.saldo -= valor;
    //Somar o valor da transferência no saldo da conta de destino
    contaDestino.saldo += valor;
    const registroTransferenciaEnviadas = {
        data: dataTransacoes(),
        numero_conta_origem,
        numero_conta_destino,
        valor,
    }
    transferencias.push(registroTransferenciaEnviadas);
    return res.status(201).json();

 }
 const conferirSaldo =(req, res)=>{
    const {numero_conta, senha} = req.query;
    if(!numero_conta || !senha){
        return res.status(404).json({mensagem:'Todos os campos são obrigatório informa!'})
    }
    const conta = contas.find((conta)=>{
        return conta.numero === Number(numero_conta);
    });
    if(!conta){
        return res.status(404).json({mensagem:'Conta bancária não encontada!'})  
    }
    if(conta.usuario.senha !== senha){
        return res.status(403).json({mensagem: "A senha da conta informada é inválida!"}); 
    }
    return res.status(200).json({saldo: conta.saldo})

 }
 const conferirExtrato = (req, res)=>{
    const {numero_conta, senha} = req.query;
    if(!numero_conta || !senha){
        return res.status(400).json({mensagem:'Todos os campos são obrigatório informa!'})
    }
    const conta = contas.find((conta)=>{
        return conta.numero === Number(numero_conta);
    });
    if(!conta){
        return res.status(404).json({mensagem:'Conta bancária não encontada!'})  
    }
    if(conta.usuario.senha !== senha){
        return res.status(403).json({mensagem: "A senha da conta informada é inválida!"}); 
    }
    const contaEspercificaDeposito = depositos.filter((deposito)=>{ return deposito.numero_conta === numero_conta})
    const contaEspercificaSaque = saques.filter((saque)=>{ return saque.numero_conta === numero_conta})
    const contaEspercificaTransferencias = transferencias.filter((transferencia)=>{ return transferencia.numero_conta_origem === numero_conta})
    const contaEspercificaTransferenciasRecebida = transferencias.filter((transferencia)=>{ return transferencia.numero_conta_destino === numero_conta})
    
    return res.status(200).json({depositos: contaEspercificaDeposito, 
        saques: contaEspercificaSaque, 
        transferenciasEnviadas: contaEspercificaTransferencias, 
        transferenciasRecebidas: contaEspercificaTransferenciasRecebida})
 }
module.exports = {
    depositarNaConta,
    sacar,
    transferir,
    conferirSaldo,
    conferirExtrato
}