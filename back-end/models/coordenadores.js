const mongoose = require('mongoose');
const coordSchema = new mongoose.Schema({
    nome: {
        type: String, 
        required: true, 
    },
    siape: {
        type: String, 
        required: true, 
    },
    email: {
        type: String, 
        required: true, 
    },
    telefone: {
        type: String, 
        required: true, 
    },
    senha: {
        type: String, 
        required: true, 
    },
    created: {
        type: Date, 
        required: true, 
        default: Date.now,
    }
});
module.exports = mongoose.model('Coordenador', coordSchema);