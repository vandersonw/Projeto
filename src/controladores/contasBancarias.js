 let {contas} = require('../bancodedados');
 
 //verificar se todo os campos foram informados
 const verificarCampos = (campos)=>{
   const {nome, cpf, data_nascimento, telefone, email, senha} = campos;
   return nome && cpf && data_nascimento && telefone && email && senha;
 }
 //verificação se já existe uma conta com CPF ou EMAIL
 const verificarCampoUnico = (cpf, email)=>{
   return contas.find((conta)=>{
      return conta.usuario.cpf === cpf || conta.usuario.email === email;
   });
 }

 const listar = (req, res)=>{
   const {senha_banco} = req.query; 
   if(senha_banco !== 'Cubos123Bank'){
      return res.status(403).json({mensagem: "A senha do banco informada é inválida!"});
    }
   return res.status(200).json(contas);
 };
 
 const criarContaBancaria = (req, res)=>{
   const {nome, cpf, data_nascimento, telefone, email, senha} = req.body;
   const numeroDaConta = contas.length + 1;
   
   // verificação se já existe uma conta com CPF ou EMAIL
   if(verificarCampoUnico(cpf, email)){
    return res.status(400).json({mensagem:'Já existe uma conta com o cpf ou e-mail informado!'})
   }
   //Verificação se todos os campos foram informados
   if(!verificarCampos(req.body)){
      return res.status(400).json({mensagem:'Todos os campos são obrigatório informa'})
   }
   // criação da conta
   const novaConta ={
      numero: numeroDaConta,
      saldo: 0,
      usuario:{
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha
   }
 }
   contas.push(novaConta);
   return res.status(201).json();
  };
 const atualizarUsuarioDaConta = (req, res)=>{
   const {nome, cpf, data_nascimento, telefone, email, senha} = req.body;
   const numeroConta = Number(req.params.numeroConta);

   //Verificação se todos os campos foram informados
   if(!verificarCampos(req.body)){
      return res.status(400).json({mensagem:'Todos os campos são obrigatório informa'})
   }
   // verificação se esse numero é de uma conta
   const conta = contas.find((conta)=>{
      return conta.numero === numeroConta; 
   });
   if(!conta){
      return res.status(403).json({mensagem:'O numero da conta passado como parametro na URL não é válida'})
   }
   // verificação se já existe uma conta com CPF ou EMAIL
   if(verificarCampoUnico(cpf, email)){
    return res.status(400).json({mensagem:'Já existe uma conta com o cpf ou e-mail informado!'})
   }
   conta.usuario.nome = nome;
   conta.usuario.cpf = cpf;
   conta.usuario.data_nascimento = data_nascimento;
   conta.usuario.telefone = telefone;
   conta.usuario.email = email;
   conta.usuario.senha = senha;

   return res.status(204).json();
}
 const excluirUmaConta = (req, res)=>{
   const numeroConta = Number(req.params.numeroConta);

   const conta = contas.find((conta)=>{
      return conta.numero === numeroConta; 
   });
   if(!conta){
      return res.status(403).json({mensagem:'O numero da conta passado como parametro na URL não é válida'})
   }
   if(conta.saldo !== 0){
      return res.status(404).json({mensagem:'A conta só pode ser removida se o saldo for zero!'})
   }

   contas = contas.filter((conta)=>{ 
      return conta.numero !== numeroConta
   });

   return res.status(200).json()
}
 module.exports= {
   listar,
   criarContaBancaria,
   atualizarUsuarioDaConta,
   excluirUmaConta
 }