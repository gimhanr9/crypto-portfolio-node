#!/usr/bin/env node

require('dotenv').config();
const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const ora = require('ora');
const cliSpinners = require('cli-spinners');
const pkgJson = require('../package.json');
const portfolioController = require('../controllers/portfolioController');

const main = async () => {
  console.log(
    chalk.yellow(
      figlet.textSync('Crypto Portfolio', { horizontalLayout: 'full' })
    )
  );

  console.log();

  const spinner = ora({
    spinner: cliSpinners.line,
    color: 'blue',
    hideCursor: false,
  });

  program
    .command('latest')
    .description('Get the latest portfolio value per token in USD')
    .action(async () => {
      try {
        spinner.start(
          chalk.blue('Loading latest portfolio values for tokens...')
        );
        const result = await portfolioController.getLatestPortfolioValues();
        spinner.succeed(chalk.green('Successfully loaded portfolio values!'));
        console.log(
          chalk.green(
            'Latest portfolio value: $' + result.portfolioValueUSD.toFixed(2)
          )
        );
        console.log();
        console.log(chalk.green('Portfolio Breakdown:'));
        result.portfolio.forEach((token) => {
          console.log(
            chalk.yellow(token.token + ': ') +
              chalk.green('$' + token.value.toFixed(2)) +
              ' (' +
              chalk.green('$' + token.price.toFixed(2)) +
              chalk.blue(' per token') +
              ')'
          );
        });
        console.log();
      } catch (error) {
        spinner.fail();
        console.error(chalk.red('Error:', error.message));
      }
    });

  program
    .command('token <token>')
    .description('Get the latest portfolio value for a given token in USD')
    .action(async (token) => {
      try {
        spinner.start(
          chalk.blue('Loading latest portfolio value for token...')
        );
        const result = await portfolioController.getLatestPortfolioValueByToken(
          token
        );
        spinner.succeed(
          chalk.green('Successfully loaded latest portfolio value for token!')
        );
        console.log(
          chalk.green(
            `Latest portfolio value for ${token}: $` + result.toFixed(2)
          )
        );
      } catch (error) {
        spinner.fail();
        console.error(chalk.red('Error:', error.message));
      }
    });

  program
    .command('date <date>')
    .description('Get the portfolio value per token in USD on a given date')
    .action(async (date) => {
      try {
        spinner.start(
          chalk.blue('Loading portfolio value for tokens on given date...')
        );
        const result = await portfolioController.getPortfolioValuesOnDate(date);
        spinner.succeed(
          chalk.green(
            'Successfully loaded portfolio value for tokens on given date!'
          )
        );
        console.log(
          chalk.green(
            `Portfolio value on ${date}: $` +
              result.portfolioValueUSD.toFixed(2)
          )
        );
        console.log();
        console.log(chalk.green('Portfolio Breakdown:'));
        result.portfolio.forEach((token) => {
          console.log(
            chalk.yellow(token.token + ': ') +
              chalk.green('$' + token.value.toFixed(2)) +
              ' (' +
              chalk.green('$' + token.price.toFixed(2)) +
              chalk.blue(' per token') +
              ')'
          );
        });
      } catch (error) {
        spinner.fail();
        console.error(chalk.red('Error:', error.message));
      }
    });

  program
    .command('value <date> <token>')
    .description(
      'Get the portfolio value of a given token in USD on the given date'
    )
    .action(async (date, token) => {
      try {
        spinner.start(
          chalk.blue('Loading portfolio value for token on date...')
        );
        const result =
          await portfolioController.getPortfolioValuesOfTokenOnDate(
            date,
            token
          );
        spinner.succeed(
          chalk.green('Successfully loaded portfolio value for token on date!')
        );
        console.log(
          chalk.green(
            `Portfolio value of ${token} on ${date}: $` + result.toFixed(2)
          )
        );
      } catch (error) {
        spinner.fail();
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
