const axios = require('axios');

const {
  readDataFromCSV,
  getCryptoPriceInUSD,
  getTransactionsUptoDate,
  getCryptoPriceInUSDOnDate,
  getTokenBalance,
  getTokenBalanceOnDate,
} = require('../utils/helperFunctions');

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

const getPortfolioValuesOnDate = async (enteredDate) => {
  try {
    let date = new Date(enteredDate);
    let unixTimeStamp = Math.floor(date.getTime() / 1000);

    const transactionsUptoDate = getTransactionsUptoDate(transactions, date);
    const tokens = [
      ...new Set(transactionsUptoDate.map((transaction) => transaction.token)),
    ];

    let portfolioValue = 0;

    const portfolio = tokens.map(async (token) => {
      let tokenPrice = await getCryptoPriceInUSDOnDate(token, unixTimeStamp);
      let tokenPriceOnDate = tokenPrice[token].USD;
      let tokenBalanceUptoDate = getTokenBalanceOnDate(
        transactions,
        token,
        date
      );
      let tokenValue = tokenBalanceUptoDate * tokenPriceOnDate;
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

const getPortfolioValueOfTokenOnDate = async (enteredDate, token) => {
  try {
    let date = new Date(enteredDate);
    const unixTimeStamp = Math.floor(date.getTime() / 1000);
    let tokenPrice = await getCryptoPriceInUSDOnDate(token, unixTimeStamp);
    let tokenPriceOnDate = tokenPrice[token].USD;
    let tokenBalanceUptoDate = getTokenBalanceOnDate(transactions, token, date);
    let tokenValueOnDate = tokenBalanceUptoDate * tokenPriceOnDate;
    return tokenValueOnDate;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  init,
  getLatestPortfolioValues,
  getLatestPortfolioValueOfToken,
  getPortfolioValuesOnDate,
  getPortfolioValueOfTokenOnDate,
};
