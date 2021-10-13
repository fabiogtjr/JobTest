const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const account = require('./routes/account');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const options = {
  explorer: true,
};

mongoose
  .connect('mongodb://db:27017/dockapp', {
    useNewUrlParser: true,
  })
  .then(result => {
    console.log('MongoDB Conectado');
  })
  .catch(error => {
    console.log(error);
  });

const app = express();

app.use(express.json());
app.use(cors());
app.use('/apis-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
app.use('/account', account);

app.listen(process.env.PORT || 8080);
