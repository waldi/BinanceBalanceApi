'use strict';
import http from 'http';
import config from './config';
import binanceService from './binanceService';

const app = http.createServer(function(req, res) {
  binanceService.getAccountInfo(req.headers.key, req.headers.secret)
  .then((accountInfo) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(accountInfo));
    res.end();
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });
});

app.listen(config.port);
console.log(`Listening on port ${config.port}`);
