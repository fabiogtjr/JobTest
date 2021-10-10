const mongoose = require('mongoose');

const Pessoas = new mongoose.Schema({
  nome: String,
  cpf: String,
  dataNascimento: Date,
});

module.exports = mongoose.model('Pessoas', Pessoas);
