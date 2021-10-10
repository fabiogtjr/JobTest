const { Router } = require('express');
const routes = Router();

const dayjs = require('dayjs');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const Contas = require('../models/Contas');
const Pessoas = require('../models/Pessoas');

routes.get('/', async (req, res) => {
  return res.status(200).json('Bem vindo as API"s Dock');
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

    const newAccount = await Contas({ ...req.body, dataCriacao: dayjs().toISOString() }).save();

    return res.status(200).json(newAccount);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = routes;
