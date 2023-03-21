const axios = require('axios');

const {
  getCSVStream,
  getCryptoPriceInUSD,
  getCryptoPriceInUSDOnDate,
  compareDates,
  getUnixTimeStamp,
} = require('../utils/helperFunctions');

const getLatestPortfolioValues = async () => {
  const csvStream = getCSVStream();
  const portfolioData = {};
  let csvTokens = [];
  let portfolioValueUSD = 0;
  try {
    for await (const transaction of csvStream) {
      const { transaction_type, token, amount } = transaction;
      const tokenAmount = parseFloat(amount);

      if (!portfolioData[token]) {
        portfolioData[token] = {
          amount: 0,
        };
        csvTokens.push(token);
      }

      if (transaction_type === 'DEPOSIT') {
        portfolioData[token].amount += tokenAmount;
      } else if (transaction_type === 'WITHDRAWAL') {
        portfolioData[token].amount -= tokenAmount;
      }
    }

    const latestPrices = await getCryptoPriceInUSD(csvTokens);
    const portfolio = csvTokens.map((token) => {
      let tokenPriceUSD = latestPrices[token].USD;
      let tokenPortfolioValueUSD = portfolioData[token].amount * tokenPriceUSD;
      portfolioValueUSD += tokenPortfolioValueUSD;
      return {
        token,
        value: tokenPortfolioValueUSD,
        price: tokenPriceUSD,
      };
    });

    return {
      portfolio,
      portfolioValueUSD,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const getLatestPortfolioValueOfToken = async (enteredToken) => {
  let tokenArray = [enteredToken];
  const csvStream = getCSVStream();
  let tokenTotal = 0;

  try {
    for await (const transaction of csvStream) {
      const { transaction_type, token, amount } = transaction;
      const tokenAmount = parseFloat(amount);

      if (enteredToken === token) {
        if (transaction_type === 'DEPOSIT') {
          tokenTotal += tokenAmount;
        } else if (transaction_type === 'WITHDRAWAL') {
          tokenTotal -= tokenAmount;
        }
      }
    }

    if (tokenTotal === 0) {
      throw new Error('Token balance upto date is 0');
    } else {
      const latestPrices = await getCryptoPriceInUSD(tokenArray);
      let tokenPriceUSD = latestPrices[enteredToken].USD;
      let portfolioValueUSD = tokenTotal * tokenPriceUSD;
      return portfolioValueUSD;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getPortfolioValuesOnDate = async (enteredDate) => {
  const csvStream = getCSVStream();
  const portfolioData = {};
  let csvTokens = [];
  let portfolioValueUSD = 0;
  try {
    let unixTimeStamp = getUnixTimeStamp(enteredDate);

    for await (const transaction of csvStream) {
      const { timestamp, transaction_type, token, amount } = transaction;
      const tokenAmount = parseFloat(amount);

      if (compareDates(timestamp, unixTimeStamp)) {
        if (!portfolioData[token]) {
          portfolioData[token] = {
            amount: 0,
          };
          csvTokens.push(token);
        }

        if (transaction_type === 'DEPOSIT') {
          portfolioData[token].amount += tokenAmount;
        } else if (transaction_type === 'WITHDRAWAL') {
          portfolioData[token].amount -= tokenAmount;
        }
      }
    }

    if (csvTokens.length > 0) {
      const portfolio = await Promise.all(
        csvTokens.map(async (token) => {
          let tokenPriceOnDate = await getCryptoPriceInUSDOnDate(
            token,
            unixTimeStamp
          );
          let tokenPriceOnDateUSD = tokenPriceOnDate[token].USD;
          let tokenPortfolioValueUSD =
            portfolioData[token].amount * tokenPriceOnDateUSD;
          portfolioValueUSD += tokenPortfolioValueUSD;
          return {
            token,
            value: tokenPortfolioValueUSD,
            price: tokenPriceOnDateUSD,
          };
        })
      );

      return {
        portfolio,
        portfolioValueUSD,
      };
    } else {
      throw new Error('No records for given token');
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getPortfolioValueOfTokenOnDate = async (enteredDate, enteredToken) => {
  const csvStream = getCSVStream();
  let tokenTotal = 0;
  try {
    let unixTimeStamp = getUnixTimeStamp(enteredDate);

    for await (const transaction of csvStream) {
      const { timestamp, transaction_type, token, amount } = transaction;
      const tokenAmount = parseFloat(amount);

      if (compareDates(timestamp, unixTimeStamp) && enteredToken === token) {
        if (transaction_type === 'DEPOSIT') {
          tokenTotal += tokenAmount;
        } else if (transaction_type === 'WITHDRAWAL') {
          tokenTotal -= tokenAmount;
        }
      }
    }

    if (tokenTotal === 0) {
      throw new Error('Token balance as of given date is 0');
    } else {
      let tokenPriceOnDate = await getCryptoPriceInUSDOnDate(
        enteredToken,
        unixTimeStamp
      );
      let tokenPriceOnDateUSD = tokenPriceOnDate[enteredToken].USD;
      let tokenPortfolioValueOnDate = tokenTotal * tokenPriceOnDateUSD;
      return tokenPortfolioValueOnDate;
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getLatestPortfolioValues,
  getLatestPortfolioValueOfToken,
  getPortfolioValuesOnDate,
  getPortfolioValueOfTokenOnDate,
};
