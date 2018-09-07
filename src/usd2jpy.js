const getAsync = require('./getAsync');

const request = getAsync('https://www.gaitameonline.com/rateaj/getrate');
const state = { open: null };

module.exports = async (usd) => {
  if (!state.open) {
    const { quotes } = JSON.parse(await request);
    state.open = (quotes.find(({ currencyPairCode }) => currencyPairCode === 'USDJPY') || {}).open;
  }
  return Number(usd) * state.open;
};
