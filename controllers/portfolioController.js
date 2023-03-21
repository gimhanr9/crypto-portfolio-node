const portfolioService = require('../services/portfolioService');

exports.getLatestPortfolioValues = async () => {
  try {
    const latestPortfolioValues =
      await portfolioService.getLatestPortfolioValues();
    return latestPortfolioValues;
  } catch (error) {
    throw new Error('Unable to get latest portfolio values: ' + error.message);
  }
};

exports.getLatestPortfolioValueByToken = async (token) => {
  try {
    const latestPortfolioValueOfToken =
      await portfolioService.getLatestPortfolioValueOfToken(token);
    return latestPortfolioValueOfToken;
  } catch (error) {
    throw new Error(
      'Unable to get latest portfolio value of token: ' + error.message
    );
  }
};

exports.getPortfolioValuesOnDate = async (date) => {
  try {
    const portfolioValuesOnDate =
      await portfolioService.getPortfolioValuesOnDate(date);
    return portfolioValuesOnDate;
  } catch (error) {
    throw new Error(
      'Unable to get portfolio values on given date: ' + error.message
    );
  }
};

exports.getPortfolioValuesOfTokenOnDate = async (date, token) => {
  try {
    const portfolioValueOfTokenOnDate =
      await portfolioService.getPortfolioValueOfTokenOnDate(date, token);
    return portfolioValueOfTokenOnDate;
  } catch (error) {
    throw new Error(
      'Unable to get portfolio value of token on given date: ' + error.message
    );
  }
};
