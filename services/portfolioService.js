const axios = require('axios');
const { readDataFromCSV } = require('../utils/csvParser');
const { getCryptoPriceInUSD } = require('../utils/getCryptoPrice');
const { getTokenBalance } = require('../utils/getTokenBalance');

let transactions = [];

const init = async () => {
  transactions = await readDataFromCSV();
};

const getLatestPortfolioValues = async () => {
  const tokens = [
    ...new Set(transactions.map((transaction) => transaction.token)),
  ];

  try {
    const latestPrices = await getCryptoPriceInUSD(tokens);
    let portfolioValue = 0;
    const portfolio = tokens.map((token) => {
      let tokenPrice = latestPrices[token].USD;
      let tokenBalance = getTokenBalance(transactions, token);
      let tokenValue = tokenBalance * tokenPrice;
      portfolioValue += tokenValue;
      return {
        token,
        value: tokenValue,
        price: tokenPrice,
      };
    });

    return {
      portfolio,
      portfolioValue,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getLatestPortfolioValueOfToken = async (token) => {
  let tokenArray = [token];
  try {
    const latestPrices = await getCryptoPriceInUSD(tokenArray);
    let tokenPrice = latestPrices[token].USD;
    let tokenBalance = getTokenBalance(transactions, token);
    let portfolioValue = tokenBalance * tokenPrice;
    return portfolioValue;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getPortfolioValuesOnDate = (date) => {
  console.log('Portfolio value per token');
};

const getPortfolioValueOfTokenOnDate = (date, token) => {
  console.log('Value of token on date');
};

module.exports = {
  init,
  getLatestPortfolioValues,
  getLatestPortfolioValueOfToken,
  getPortfolioValuesOnDate,
  getPortfolioValueOfTokenOnDate,
};
