import Binance from 'binance-api-node'
import https from 'https';
import config from './config';

const btcPricePromise = (symbol) => new Promise((resolve, reject) => {
  https.get(`https://api.coinbase.com/v2/prices/${symbol}/spot`, (res) => {
    let data = "";
    res.setEncoding('utf8');
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      resolve(JSON.parse(data));
    });
  });
});

const getAccountInfo = (apiKey, apiSecret) => new Promise((resolve, reject) => {
  const client = Binance({
    apiKey,
    apiSecret
  })

  Promise.all([client.accountInfo(), client.prices(), btcPricePromise('EUR'), btcPricePromise('USD')])
  .then(results => {
    const balances = results[0].balances.filter((balance) => balance.free > 0);
    const prices = results[1];

    var btc = 0;
    balances.forEach(balance => {
      const symbol = balance.asset;
      const amount = parseFloat(balance.free);
      if (symbol === 'BTC') {
        btc += amount;
        return;
      }

      btc += parseFloat(prices[`${symbol}BTC`] || 0) * amount;
    });

    const btcPriceEur = parseFloat(results[2].data.find((e) => e.base === 'BTC').amount);
    const btcPriceUsd = parseFloat(results[3].data.find((e) => e.base === 'BTC').amount);

    const accountInfo = {
      btc,
      btcPriceEur,
      btcPriceUsd,
      eur: btc * btcPriceEur,
      usd: btc * btcPriceUsd
    };

    resolve(accountInfo);
  })
  .catch(err => {
    reject(err);
  });
});

export default {
  getAccountInfo
};
