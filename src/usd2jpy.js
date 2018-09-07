'use strict';

const getAsync = require('./getAsync');
const request = getAsync('https://www.gaitameonline.com/rateaj/getrate');
let open = null;

module.exports = async (usd) => {
  if (!open) {
    const { quotes } = JSON.parse(await request);
    ({ open } = quotes.find(({ currencyPairCode }) => currencyPairCode === 'USDJPY'));
  }
  return Number(usd) * open;
};
