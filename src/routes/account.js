const { Router } = require('express');
const routes = Router();

const dayjs = require('dayjs');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const Contas = require('../models/Contas');
const Pessoas = require('../models/Pessoas');
const Transacoes = require('../models/Transacoes');

routes.get('/', async (req, res) => {
  return res.status(200).json(`Bem vindo as API's Dock`);
});

routes.post('/createAccount', async (req, res) => {
  try {
    await check(['idPessoa', 'saldo', 'limiteSaqueDiario', 'tipoConta', 'flagAtivo'])
      .exists()
      .isLength({ min: 1 })
      .run(req);
    await check('idPessoa').isLength({ min: 24, max: 24 }).run(req);
    const result = validationResult(req);
    if (!result?.isEmpty()) return res.status(400).json({ errors: result.array() });

    const userExists = await Pessoas.findOne({ _id: new mongoose.Types.ObjectId(req?.body?.idPessoa) }).exec();
    if (!userExists) return res.status(404).json({ error: 'Usuário não encontrado!' });
    const dupAccount = await Contas.findOne({ idPessoa: new mongoose.Types.ObjectId(req?.body?.idPessoa) }).exec();
    if (dupAccount) return res.status(409).json({ error: 'Conta já cadastrada!' });

    const newAccount = await Contas({
      ...req.body,
      saldo: parseFloat(req.body.saldo),
      dataCriacao: dayjs().toISOString(),
    }).save();

    return res.status(200).json(newAccount);
  } catch (err) {
    return res.status(500).json(err);
  }
});

routes.put('/bankDeposit', async (req, res) => {
  try {
    await check(['idConta', 'valor']).exists().isLength({ min: 1 }).run(req);
    await check('idConta').isLength({ min: 24, max: 24 }).run(req);
    const result = validationResult(req);
    if (!result?.isEmpty()) return res.status(400).json({ errors: result.array() });

    const newTransaction = await Transacoes({ ...req?.body, dataTransacao: dayjs().toISOString() }).save();
    const newBalance = parseFloat(account?.saldo) + parseFloat(req?.body?.valor);
    if (!newTransaction || !newBalance) return res.status(500).json({ error: 'Erro ao efetuar transação!' });

    const updateAccount = await Contas.findOneAndUpdate({
      _id: new mongoose.Types.ObjectId(req?.body?.idConta),
      saldo: newBalance,
    }).exec();

    if (!updateAccount) return res.status(404).json({ error: 'Conta não encontrada!' });

    return res.status(200).json({ ...updateAccount._doc, saldo: newBalance });
  } catch (err) {
    return res.status(500).json(err);
  }
});

routes.get('/getBalance', async (req, res) => {
  try {
    await check('idConta').exists().isLength({ min: 24, max: 24 }).run(req);
    const result = validationResult(req);
    if (!result?.isEmpty()) return res.status(400).json({ errors: result.array() });

    const idConta = req.query.idConta;

    const account = await Contas.findOne({ _id: new mongoose.Types.ObjectId(idConta) }).exec();
    if (!account) return res.status(404).json({ error: 'Conta não encontrada!' });

    return res.status(200).json(account?.saldo);
  } catch (err) {
    return res.status(500).json(err);
  }
});

routes.put('/bankWithdraw', async (req, res) => {
  try {
    await check(['idConta', 'valor']).exists().isLength({ min: 1 }).run(req);
    await check('idConta').isLength({ min: 24, max: 24 }).run(req);
    const result = validationResult(req);
    if (!result?.isEmpty()) return res.status(400).json({ errors: result.array() });

    const newTransaction = await Transacoes({ ...req?.body, dataTransacao: dayjs().toISOString() }).save();
    const accountBalance = parseFloat(account?.saldo);
    const withdrawValue = parseFloat(req?.body?.valor);
    if (withdrawValue > accountBalance) return res.status(404).json({ error: 'Saldo Insuficiente!' });
    const newBalance = parseFloat(account?.saldo) - parseFloat(req?.body?.valor);
    if (!newTransaction || !newBalance) return res.status(500).json({ error: 'Erro ao efetuar transação!' });

    const updateAccount = await Contas.findOneAndUpdate({
      _id: new mongoose.Types.ObjectId(req?.body?.idConta),
      saldo: newBalance,
    }).exec();

    if (!updateAccount) return res.status(404).json({ error: 'Conta não encontrada!' });

    return res.status(200).json({ ...updateAccount._doc, saldo: newBalance });
  } catch (err) {
    return res.status(500).json(err);
  }
});

routes.put('/disableAccount', async (req, res) => {
  try {
    await check('idConta').exists().isLength({ min: 24, max: 24 }).run(req);
    const result = validationResult(req);
    if (!result?.isEmpty()) return res.status(400).json({ errors: result.array() });

    const updateAccount = await Contas.findOneAndUpdate({
      _id: new mongoose.Types.ObjectId(req?.body?.idConta),
      flagAtivo: false,
    }).exec();

    if (!updateAccount) return res.status(404).json({ error: 'Conta não encontrada!' });

    return res.status(200).json({ ...updateAccount._doc, flagAtivo: false });
  } catch (err) {
    return res.status(500).json(err);
  }
});

routes.get('/bankStatement', async (req, res) => {
  try {
    await check('idConta').exists().isLength({ min: 24, max: 24 }).run(req);
    const result = validationResult(req);
    if (!result?.isEmpty()) return res.status(400).json({ errors: result.array() });

    const { idConta } = req.query;

    const account = await Contas.find({ id: new mongoose.Types.ObjectId(idConta) }).exec();
    if (!account) return res.status(404).json({ error: 'Conta não encontrada!' });

    const statement = await Transacoes.find({ idConta: idConta });

    return res.status(200).json(statement);
  } catch (err) {
    return res.status(500).json(err);
  }
});

routes.get('/bankStatementByperiod', async (req, res) => {
  try {
    await check(['startDate', 'endDate']).exists().isLength({ min: 1 }).run(req);
    await check('idConta').exists().isLength({ min: 24, max: 24 }).run(req);
    const result = validationResult(req);
    if (!result?.isEmpty()) return res.status(400).json({ errors: result.array() });

    const { idConta, startDate, endDate } = req.query;

    const account = await Contas.find({ id: new mongoose.Types.ObjectId(idConta) }).exec();
    if (!account) return res.status(404).json({ error: 'Conta não encontrada!' });

    const statement = await Transacoes.find({
      idConta: idConta,
      dataTransacao: { $gte: dayjs(startDate).toISOString(), $lte: dayjs(endDate).toISOString() },
    });

    return res.status(200).json(statement);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = routes;
