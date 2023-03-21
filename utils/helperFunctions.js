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
    throw new Error(error);
  }
};

const getCryptoPriceInUSDOnDate = async (token, timeStamp) => {
  const apiUrl = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${token}&tsyms=USD&ts=${timeStamp}&api_key=${process.env.CRYPTOCOMPARE_API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    const priceOnDate = response.data;
    return priceOnDate;
  } catch (error) {
    throw new Error(error);
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

function compareDates(timestampCSV, timestampUser) {
  // Create a date object from unix timestamp by converting it to milliseconds (*1000)
  const dateCSV = new Date(timestampCSV * 1000);
  const dateUser = new Date(timestampUser * 1000);

  // Set time component to start of day (00:00:00) to ignore the time when comparing
  dateCSV.setHours(0, 0, 0, 0);
  dateUser.setHours(0, 0, 0, 0);

  return dateCSV <= dateUser;

  //   const csvDate =
  //     timestampCSVDate.getDate() +
  //     '/' +
  //     (timestampCSVDate.getMonth() + 1) +
  //     '/' +
  //     timestampCSVDate.getFullYear();

  //   const userDate =
  //     timestampUserDate.getDate() +
  //     '/' +
  //     (timestampUserDate.getMonth() + 1) +
  //     '/' +
  //     timestampUserDate.getFullYear();
}

const getTransactionsUptoDate = (transactions, timestamp) => {
  const transactionsUptoDate = transactions.filter((transaction) =>
    compareDates(transaction.timestamp, timestamp)
  );

  return transactionsUptoDate;
};

const getTokenBalanceOnDate = (transactions, token, timestamp) => {
  //const transactionsUptoDate = getTransactionsUptoDate(transactions, timestamp);

  const depositValueUptoDate = transactions
    .filter(
      (transaction) =>
        compareDates(transaction.timestamp, timestamp) &&
        transaction.token === token &&
        transaction.transaction_type === 'DEPOSIT'
    )
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  const withdrawalValueUptoDate = transactions
    .filter(
      (transaction) =>
        compareDates(transaction.timestamp, timestamp) &&
        transaction.token === token &&
        transaction.transaction_type === 'WITHDRAWAL'
    )
    .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

  const tokenBalanceUptoDate = depositValueUptoDate - withdrawalValueUptoDate;

  return tokenBalanceUptoDate;
};

const getUnixTimeStamp = (date) => {
  const dateObject = new Date(date);
  return Math.floor(dateObject.getTime() / 1000);
};

module.exports = {
  readDataFromCSV,
  getCryptoPriceInUSD,
  getTransactionsUptoDate,
  getCryptoPriceInUSDOnDate,
  getTokenBalance,
  getTokenBalanceOnDate,
  getUnixTimeStamp,
};
