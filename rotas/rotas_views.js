const express = require('express');
const rotas = express.Router();
const Coordenador = require('../back-end/models/coordenadores');
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    const {senha, coor_email} = req.body;

    try {
        //busca email na base de dados
        const coordenador = await Coordenador.findOne({email:coor_email});

        //checar password
        const checkPassword = bcryp.compare(senha, coordenador.senha);
        
        if(checkPassword) {

            const secret = process.env.SECRET; 

            const token = jwt.sign({
                id: coordenador._id, 
            }, secret)

            //recuperando email para ser uma session
            req.session.login = coordenador.nome;
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
        req.session.message = {
            type:"danger",
            message: "Senha e/ou usuário invalido!" 
        }
        console.log("Email não encontrado.");
        res.redirect('/login');
    }
})

//rotas privadas
rotas.get('/painel/', async (req, res) => {

    try {
        
        res.render('Pages_privates/dashboard', {
            title: 'Painel'
        })
        
    } catch (error) {
        console.log(error);
    }
})

//como implementar para que o usuário navegue nas páginas privadas.
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]

    console.log("autorizacao para navegar no painel"+authHeader);
    console.log("valor do token "+token);


    if(!token) {
        return res.status(401).json({msg: "acesso negado!"})
    }
    try {

        const secret = process.env.SECRET; 
        jwt.verify(token, secret);
        next()
        
    } catch (error) {
        res.status(400).json({msg: "Token invalido"})
    }

}

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
    
    const salt = await bcryp.genSalt(12);
    const passHash = await bcryp.hash(password, salt);
    
    const coordenador = new Coordenador({
        nome,
        siape, 
        email,
        telefone,
        senha: passHash
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