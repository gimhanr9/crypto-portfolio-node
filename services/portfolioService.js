require('dotenv').config();
const axios = require('axios');
const { readDataFromCSV } = require('../utils/csvParser');
console.log(process.env);

const getLatestPortfolioValues = () => {};

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
