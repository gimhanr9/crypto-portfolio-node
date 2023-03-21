const axios = require('axios');

const {
  readDataFromCSV,
  getCryptoPriceInUSD,
  getTransactionsUptoDate,
  getCryptoPriceInUSDOnDate,
  getTokenBalance,
  getTokenBalanceOnDate,
  getUnixTimeStamp,
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
    throw new Error(error);
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
    throw new Error(error);
  }
};

const getPortfolioValuesOnDate = async (enteredDate) => {
  try {
    let unixTimeStamp = getUnixTimeStamp(enteredDate);

    const transactionsUptoDate = getTransactionsUptoDate(
      transactions,
      unixTimeStamp
    );
    const tokens = [
      ...new Set(transactionsUptoDate.map((transaction) => transaction.token)),
    ];

    if (tokens.length > 0) {
      let portfolioValue = 0;

      const portfolio = await Promise.all(
        tokens.map(async (token) => {
          let tokenPrice = await getCryptoPriceInUSDOnDate(
            token,
            unixTimeStamp
          );
          let tokenPriceOnDate = tokenPrice[token].USD;
          let tokenBalanceUptoDate = getTokenBalanceOnDate(
            transactions,
            token,
            unixTimeStamp
          );
          let tokenValue = tokenBalanceUptoDate * tokenPriceOnDate;
          portfolioValue += tokenValue;
          return {
            token,
            value: tokenValue,
            price: tokenPrice,
          };
        })
      );

      return {
        portfolio,
        portfolioValue,
      };
    } else {
      throw new Error('No records for given token');
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getPortfolioValueOfTokenOnDate = async (enteredDate, token) => {
  try {
    let date = new Date(enteredDate);
    const unixTimeStamp = getUnixTimeStamp(date);
    let tokenPrice = await getCryptoPriceInUSDOnDate(token, unixTimeStamp);
    let tokenPriceOnDate = tokenPrice[token].USD;
    let tokenBalanceUptoDate = getTokenBalanceOnDate(transactions, token, date);
    let tokenValueOnDate = tokenBalanceUptoDate * tokenPriceOnDate;
    return tokenValueOnDate;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  init,
  getLatestPortfolioValues,
  getLatestPortfolioValueOfToken,
  getPortfolioValuesOnDate,
  getPortfolioValueOfTokenOnDate,
};
