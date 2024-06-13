//para poder enchergar o .env
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');

//DB_URL = mongodb://localhost:27017/db_jifs

const app = express();
const PORTA = process.env.PORT || 4000;

//
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'front-end')));


app.use(session({
    secret:'minha chave secreta',
    saveUninitialized: true,
    resave: false, 
}));


app.use((req, res, next)=> {
    res.locals.message = req.session.message; 
    delete req.session.message; 
    next();
})


//comunicacao com banco de dados
//conexão com o db
mongoose.connect(process.env.DB_URL);
const db = mongoose.connection; 
db.on("error", (error)=> {
    console.log(error);
});
db.once("open", ()=> {
    console.log("banco de dados conectado!");
})

//atualizar o projeto no github sem atualizar no vercel, como fazer isso. 

//redefinindo a pasta views para ser encontrada pelo express
app.set('views', path.join(__dirname, 'front-end', 'views'));
app.set('view engine', 'ejs');

app.use('', require('./rotas/rotas_views'));


app.listen(PORTA, ()=> {
    console.log(`Servidor iniciado na porta http://localhost:${PORTA}`)
})
//para funcionar na vercel alterar localhost
//console.log(`Servidor iniciado na porta http://localhost:${PORTA}`)

//quando for colocar pra subir no vercel tem que colocar só a porta, tirar o local host