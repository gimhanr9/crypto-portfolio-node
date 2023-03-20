const axios = require('axios');

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

module.exports = { getCryptoPriceInUSD };
