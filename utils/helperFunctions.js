const fs = require('fs');
const { Readable } = require('stream');
const { parse } = require('csv-parse');
const axios = require('axios');

const getCSVStream = () => {
  const csvStream = fs
    .createReadStream('data/transactions.csv')
    .pipe(parse({ columns: true }));

  const readableStream = new Readable({
    objectMode: true,
    read() {},
  });

  csvStream
    .on('data', (data) => {
      readableStream.push(data);
    })
    .on('end', () => {
      readableStream.push(null);
    })
    .on('error', (error) => {
      readableStream.destroy(error);
    });

  return readableStream;
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

function compareDates(timestampCSV, timestampUser) {
  // Create a date object from unix timestamp by converting it to milliseconds (*1000)
  const dateCSV = new Date(timestampCSV * 1000);
  const dateUser = new Date(timestampUser * 1000);

  // Set time component to start of day (00:00:00) to ignore the time when comparing
  dateCSV.setHours(0, 0, 0, 0);
  dateUser.setHours(0, 0, 0, 0);

  return dateCSV <= dateUser;
}

const getUnixTimeStamp = (date) => {
  if (!(date instanceof Date)) {
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = date.match(dateRegex);
    if (!match) {
      throw new Error('Invalid date format');
    }
    date = new Date(match[3], match[2] - 1, match[1]);
  }
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date value');
  }
  return Math.floor(date.getTime() / 1000);
};

module.exports = {
  getCSVStream,
  getCryptoPriceInUSD,
  getCryptoPriceInUSDOnDate,
  compareDates,
  getUnixTimeStamp,
};
