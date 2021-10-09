const { Router } = require('express');
const routes = Router();
const { check, validationResult } = require('express-validator');

const Contas = require('../models/Contas');

routes.get('/', async (req, res) => {
  return res.status(200).json('Bem vindo as API"s Dock');
});

routes.post('/createAccount', async (req, res) => {
  try {
    await check('idPessoa').exists().run(req);
    await check('saldo').exists().run(req);
    await check('limiteSaqueDiario').exists().run(req);
    await check('tipoConta').exists().run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json({ errors: result.array() });

    return res.status(200).json('Sos');
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = routes;
