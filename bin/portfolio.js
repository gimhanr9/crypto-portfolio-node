#!/usr/bin/env node

const { program } = require('commander');
const pkgJson = require('../package.json');
const portfolioController = require('../controllers/portfolioController');

program
  .command('latest')
  .description('Get the latest portfolio value per token in USD')
  .action(() => {
    portfolioController.getLatestPortfolioValues();
  });

// program.action(() => {
//   getLatestPortfolioValues();
// });

program
  .command('token <token>')
  .description('Get the latest portfolio value for a given token in USD')
  .action((token) => {
    portfolioController.getLatestPortfolioValueByToken(token);
  });

program
  .command('date <date>')
  .description('Get the portfolio value per token in USD on a given date')
  .action((date) => {
    portfolioController.getPortfolioValuesOnDate(date);
  });

program
  .command('value <date> <token>')
  .description(
    'Get the portfolio value of a given token in USD on the given date'
  )
  .action((date, token) => {
    portfolioController.getPortfolioValuesofTokenOnDate(date, token);
  });

program.on('command:*', () => {
  console.error(
    'Invalid command: %s\nSee --help for a list of available commands.',
    program.args.join(' ')
  );
  process.exit(1);
});

program
  .name('portfolio')
  .usage('[command] [options]')
  .description('Get portfolio values for tokens in USD')
  .version(pkgJson.version)
  .parse(process.argv);
