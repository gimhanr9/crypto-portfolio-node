#!/usr/bin/env node

require('dotenv').config();
const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const pkgJson = require('../package.json');
const portfolioController = require('../controllers/portfolioController');
const portfolioService = require('../services/portfolioService');

const main = async () => {
  await portfolioService.init();

  console.log(
    chalk.yellow(
      figlet.textSync('Crypto Portfolio', { horizontalLayout: 'full' })
    )
  );

  program
    .command('latest')
    .description('Get the latest portfolio value per token in USD')
    .action(async () => {
      try {
        const result = await portfolioController.getLatestPortfolioValues();
        console.log(
          chalk.green(
            'Latest portfolio value: $' + result.portfolioValue.toFixed(2)
          )
        );
        console.log(chalk.green('Portfolio Breakdown:'));
        result.portfolio.forEach((token) => {
          console.log(
            chalk.yellow(token.token + ': ') +
              chalk.green('$' + token.value.toFixed(2)) +
              ' (' +
              chalk.green('$' + token.price.toFixed(2)) +
              ' per token)'
          );
        });
      } catch (error) {
        console.error(chalk.red('Error:', error.message));
      }
    });

  // program.action(() => {
  //   getLatestPortfolioValues();
  // });

  program
    .command('token <token>')
    .description('Get the latest portfolio value for a given token in USD')
    .action(async (token) => {
      try {
        const result = await portfolioController.getLatestPortfolioValueByToken(
          token
        );
        console.log(
          chalk.green(
            `Latest portfolio value for ${token}: $` + result.toFixed(2)
          )
        );
      } catch (error) {
        console.error(chalk.red('Error:', error.message));
      }
    });

  program
    .command('date <date>')
    .description('Get the portfolio value per token in USD on a given date')
    .validate((date) => {
      // input validation - date format
      const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const match = date.match(dateRegex);
      if (!match) {
        console.error(chalk.red('Invalid date format'));
        return false;
      }
      const dateObject = new Date(date);
      if (dateObject.toString() === 'Invalid Date') {
        console.error(chalk.red('Invalid date value'));
        return false;
      }
      return true;
    })
    .action(async (date) => {
      try {
        const result = await portfolioController.getPortfolioValuesOnDate(date);
        console.log(
          chalk.green(
            `Portfolio value on ${date}: $` + result.portfolioValue.toFixed(2)
          )
        );
        console.log(chalk.green('Portfolio Breakdown:'));
        result.portfolio.forEach((token) => {
          console.log(
            chalk.yellow(token.token + ': ') +
              chalk.green('$' + token.value.toFixed(2)) +
              ' (' +
              chalk.green('$' + token.price.toFixed(2)) +
              ' per token)'
          );
        });
      } catch (error) {
        console.error(chalk.red('Error:', error.message));
      }
    });

  program
    .command('value <date> <token>')
    .description(
      'Get the portfolio value of a given token in USD on the given date'
    )
    .validate((date) => {
      // input validation - date format
      const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const match = date.match(dateRegex);
      if (!match) {
        console.error(chalk.red('Invalid date format'));
        return false;
      }
      const dateObject = new Date(date);
      if (dateObject.toString() === 'Invalid Date') {
        console.error(chalk.red('Invalid date value'));
        return false;
      }
      return true;
    })
    .action(async (date, token) => {
      try {
        const result =
          await portfolioController.getPortfolioValuesOfTokenOnDate();
        console.log(
          chalk.green(
            `Portfolio value of ${token} on ${date}: $` + result.toFixed(2)
          )
        );
      } catch (error) {
        console.error(chalk.red('Error:', error.message));
      }
    });

  program.on('command:*', () => {
    console.error(
      chalk.red(
        'Invalid command: %s\nSee --help for a list of available commands.',
        program.args.join(' ')
      )
    );
    process.exit(1);
  });

  program
    .name('portfolio')
    .usage('[command] [options]')
    .description('Get portfolio values for tokens in USD')
    .version(pkgJson.version)
    .parse(process.argv);
};

main();
