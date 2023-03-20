const getTokenBalance = (transactions, token) => {
  const depositValue = transactions
    .filter(
      (transaction) =>
        transaction.transaction_type === 'DEPOSIT' &&
        transaction.token === token
    )
    .reduce((total, t) => total + parseFloat(t.amount), 0);

  const withdrawalValue = transactions
    .filter(
      (transaction) =>
        transaction.transaction_type === 'WITHDRAWAL' &&
        transaction.token === token
    )
    .reduce((total, t) => total + parseFloat(t.amount), 0);

  const tokenBalance = depositValue - withdrawalValue;
  return tokenBalance;
};

module.exports = { getTokenBalance };
