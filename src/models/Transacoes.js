const mongoose = require('mongoose');

const Transacoes = new mongoose.Schema({
  idConta: String,
  valor: Number,
  dataTransacao: Date,
});

module.exports = mongoose.model('Transacoes', Transacoes);
