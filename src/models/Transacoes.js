const mongoose = require('mongoose');

const Transacoes = new mongoose.Schema({
  idTransacao: Number,
  idConta: Number,
  valor: Number,
  dataTransacao: Date,
});

module.exports = mongoose.model('Transacoes', Transacoes);
