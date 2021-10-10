const mongoose = require('mongoose');

const Contas = new mongoose.Schema({
  idPessoa: String,
  saldo: Number,
  limiteSaqueDiario: Number,
  flagAtivo: Boolean,
  tipoConta: Number,
  dataCriacao: Date,
});

module.exports = mongoose.model('Contas', Contas);
