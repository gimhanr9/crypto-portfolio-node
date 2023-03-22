# Crypto Portfolio

A NodeJS cli application to calculate the latest crypto portfolio balance in USD, get portfolio balance in USD for a particular date, get portfolio balance for a particular token and also get the portfolio balance for a particular token on a given date. In the next sections of this readme I will explain the design decisions taken at each stage and the libraries used.

## Steps to execute

There are two ways to run the program, both require that the project be cloned and the necessary packages in package.json be installed via npm install

The following would be the list of commands to use:

```
latest #gets the latest portforlio values in USD for all tokens and total portfolio balance in USD.

token <token> #accepts a value, which should be the token and would return the latest portfolio balance in USD for the token.

date <date> #accepts a date and return the balance of portfolio and all tokens in USD until and including the given date. Format - 'd/m/yyyy', 21/3/2023

value <date> <token> #accepts a date and token, where it returns the portfolio balance in USD for the given token upto and including the given date.
```

### Method 1:

1. Open a terminal in the root directory and run the below command.

```
npm start
```

2. The above command will give a list of commands to use, for example, to get the latest portfolio value for all tokens, we can run the below command:

```
npm start latest
```

3. The format would be:

```
npm start <command>
```

### Method 2:

1. Open a terminal in the root directory and run the below command.This command will create a symbolic link between local package and global npm directory which is useful in development and testing.

```
npm link
```

2. Now, the command 'portfolio' can be run from anywhere and the program will work. The subcommand for each function(stated above) should be mentioned as done below:

```
portfolio latest

portfolio token BTC or portfolio token 'BTC'
```

3. The format would be:

```
portfolio <command>
```

## Architecture

The first set of decisions when it came to designing this solution was selecting a suitable architecture and then using a simple but maintanable project structure to complement it. In the next few sections I will explain the deisions taken for each stage in detail.

## CLI (UI) design

## Security

## Error handling

## Screenshots
