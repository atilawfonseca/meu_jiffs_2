const express = require('express');
const rotas = express.Router();
const Coordenador = require('../back-end/models/coordenadores');

//CONTROLLS
const Logar = require('../back-end/controllers/coordenadores/Logar');
const Logado = require('../back-end/controllers/coordenadores/Logado');
const Deslogar = require('../back-end/controllers/coordenadores/Deslogar');


rotas.get('/', async (req, res) => {
    try {
        
        res.render('index', {
            title:'Página Inicial'
        })
    } catch (error) {
        res.json({message: error.message})
    }
})

rotas.get('/modalidades', async (req, res) => {
    try{
        res.render('modalidades', {
            title: 'Modalidades'
        })
    }
    catch(error){
        res.json({message: error.message})
    }
})

rotas.get('/login', async (req, res) => {
    try{
        res.render('login', {
            title: 'login'
        })
    }
    catch(error){
        res.json({message: error.message})
    }
})

rotas.post('/logar', async (req, res) => {
    const email_coordenador = req.body.coor_email;
    const senha_coordenador = req.body.senha; 
    try {
        //busca email na base de dados
        const coordenador = await Coordenador.find({email:email_coordenador});
        //recupera a senha do coordenador
        const senha_bd_coordenador = coordenador.map(coor => coor.senha);

        if(senha_bd_coordenador == senha_coordenador) {
            //recuperando email para ser uma session
            req.session.login = coordenador.map(coor => coor.nome);
            req.session.message = {
                type:"success",
                message: `Seja bem vindo, ${req.session.login}!` 
            }
            res.redirect('/painel')
        }
        else {
            req.session.message = {
                type:"danger",
                message: "Senha e/ou usuário invalido!" 
            }
            console.log("Email não encontrado.");
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error);
    }
})

//rotas privadas
rotas.get('/painel', async (req, res) => {
    
    try {
        
        res.render('Pages_privates/dashboard', {
            title: 'Painel'
        })
        
    } catch (error) {
        console.log(error);
    }
})

rotas.get('/cadastrar', async (req, res) => {


    try{
        res.render('cadastro', {
            title: 'cadastro'
        })
    }
    catch(error){
        res.json({message: error.message})
    }
})

rotas.post('/checkEmail', async (req, res) => {

    const email = req.body.inputEmail; 
    
    try {
        const emailExists = await Coordenador.findOne({email:email});

        const message = emailExists ? "Email existente":""
        res.json({message:message, 
            title:"Cadastrar"
        })
        
        
    } catch (error) {
        
    }
})

rotas.post('/add', async (req, res) => {
    const {nome, siape, email, telefone, password} = req.body; 
    

    
    const coordenador = new Coordenador({
        nome: req.body.nome,
        siape: req.body.siape, 
        email: req.body.email,
        telefone: req.body.telefone,
        senha: req.body.password
    })
    
    try {
        await coordenador.save();
        req.session.message = {
            type:"success",
            message: "Coordenador cadastrado com sucesso!" 
        }

        res.redirect('/');
    }
    catch (error) {
        console.error("Erro ao salvar os dados: ", error);
        res.json({message: error.message, type: "danger"})
    }
    
    
})

rotas.get('/recuperar_senha', async (req, res) => {
    try{
        res.render('recuperar_senha', {
            title: 'Recuperação de senha'
        })
    }
    catch(error){
        res.json({message: error.message})
    }
})

module.exports = rotas; 