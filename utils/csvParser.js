const fs = require('fs');
const parse = require('csv-parse');

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

module.exports = { readDataFromCSV };
