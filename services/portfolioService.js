const axios = require('axios');

const getLatestPortfolioValues = () => {
  console.log('Latest values');
};

const getLatestPortfolioValueOfToken = (token) => {
  console.log('Latest value of token');
};

const getPortfolioValuesOnDate = (date) => {
  console.log('Portfolio value per token');
};

const getPortfolioValueOfTokenOnDate = (date, token) => {
  console.log('Value of token on date');
};

module.exports = {
  getLatestPortfolioValues,
  getLatestPortfolioValueOfToken,
  getPortfolioValuesOnDate,
  getPortfolioValueOfTokenOnDate,
};
