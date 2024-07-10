const express = require('express');
const rotas = express.Router();
const Coordenador = require('../back-end/models/coordenadores');


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

rotas.post('/add', async (req, res) => {
    const coordenador = new Coordenador({
        siape: req.body.siape_coordenador, 
        email: req.body.email,
        telefone: req.body.telefone,
        senha: req.body.password
    })
    
    try {
        console.log(req.body.siape);
        console.log(req.body.email);
        console.log(req.body.telefone);
        console.log(req.body.password);
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