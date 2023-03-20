const fs = require('fs');
const parse = require('csv-parse');
const axios = require('axios');

const readDataFromCSV = async () => {
  return new Promise((resolve, reject) => {
    const rows = [];
    const parser = parse({
      columns: true,
    });

    fs.createReadStream('../data/transactions.csv')
      .pipe(parser)
      .on('data', (data) => {
        rows.push(data);
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        resolve(rows);
      });
  });
};

const getCryptoPriceInUSD = async (tokens) => {
  const apiUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tokens.join(
    ','
  )}&tsyms=USD&api_key=${process.env.CRYPTOCOMPARE_API_KEY}`;
  try {
    const response = await axios.get(apiUrl);
    const latestPrices = response.data;
    return latestPrices;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getCryptoPriceInUSDOnDate = async (token, timeStamp) => {
  const apiUrl = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${token}&tsyms=USD&ts=${timeStamp}&api_key=${process.env.CRYPTOCOMPARE_API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    const priceOnDate = response.data;
    return priceOnDate;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getTokenBalance = (transactions, token) => {
  const depositValue = transactions
    .filter(
      (transaction) =>
        transaction.transaction_type === 'DEPOSIT' &&
        transaction.token === token
    )
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  const withdrawalValue = transactions
    .filter(
      (transaction) =>
        transaction.transaction_type === 'WITHDRAWAL' &&
        transaction.token === token
    )
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  const tokenBalance = depositValue - withdrawalValue;
  return tokenBalance;
};

const getTransactionsUptoDate = (transactions, date) => {
  const transactionsUptoDate = transactions.filter(
    (transaction) =>
      transaction.token === token && new Date(transaction.date * 1000) <= date
  );

  return transactionsUptoDate;
};

const getTokenBalanceOnDate = (transactions, token, date) => {
  const transactionsUptoDate = getTransactionsUptoDate(transactions, token);

  const depositValueUptoDate = transactionsUptoDate
    .filter((transaction) => transaction.transaction_type === 'DEPOSIT')
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  const withdrawalValueUptoDate = transactionsUptoDate
    .filter((transaction) => transaction.transaction_type === 'WITHDRAWAL')
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  const tokenBalanceUptoDate = depositValueUptoDate - withdrawalValueUptoDate;

  return tokenBalanceUptoDate;
};

module.exports = {
  readDataFromCSV,
  getCryptoPriceInUSD,
  getTransactionsUptoDate,
  getCryptoPriceInUSDOnDate,
  getTokenBalance,
  getTokenBalanceOnDate,
};
