const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const account = require('./routes/account');

mongoose.connect(
  'mongodb://ugoppa1cr6f5xpjq7fjt:eHWJRMy7g10CqupBa2HZ@bvds6tc7azukcmw-mongodb.services.clever-cloud.com:27017/bvds6tc7azukcmw',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const app = express();

app.use(express.json());
app.use(cors());
app.use('/', account);

app.listen(process.env.PORT || 8080);
