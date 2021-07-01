const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
var server = require('http').createServer(app);
app.use(bodyParser.json());
const baseUrl = `/v1`;
const port = process.env.PORT || 3000;
var cors = require('cors')
const authentication = require('./modules/authentication/router');
const { idMiddleware } = require('./modules/authentication/middleware');

app.use(cors({ origin: '*' }))
app.use(baseUrl, authentication);
app.use(idMiddleware);


const error = require('./modules/errors/middleware');
app.use(baseUrl, error);
server.listen(port, function () {
  console.log('Express server of Logibids listening on port ' + port);
});