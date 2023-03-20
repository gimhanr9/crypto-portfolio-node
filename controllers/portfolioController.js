const portfolioService = require('../services/portfolioService');

exports.getLatestPortfolioValues = () => {
  const latestPortfolioValues = portfolioService.getLatestPortfolioValues();
};

exports.getLatestPortfolioValueByToken = (token) => {
  const latestPortfolioValue =
    portfolioService.getLatestPortfolioValueOfToken(token);
};

exports.getPortfolioValuesOnDate = (date) => {
  const portfolioValuesOnDate = portfolioService.getPortfolioValuesOnDate(date);
};

exports.getPortfolioValuesofTokenOnDate = (date, token) => {
  const portfolioValueOfTokenOnDate =
    portfolioService.getPortfolioValueOfTokenOnDate(date, token);
};
