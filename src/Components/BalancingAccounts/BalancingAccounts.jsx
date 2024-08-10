import React from 'react';
import { Paper, Typography, Divider } from '@mui/material';
import styles from './BalancingAccounts.module.css';

const BalancingAccounts = ({ ledger }) => {
  const calculateBalances = () => {
    const accountBalances = {};

    ledger.forEach(entry => {
      if (!accountBalances[entry.item]) {
        accountBalances[entry.item] = 0;
      }
      if (entry.type === 'income' || entry.type === 'closing') {
        accountBalances[entry.item] += entry.amount;
      } else if (entry.type === 'expense') {
        accountBalances[entry.item] -= entry.amount;
      }
    });

    return accountBalances;
  };

  const accountBalances = calculateBalances();
  const totalDebits = Object.values(accountBalances).filter(amount => amount > 0).reduce((acc, amount) => acc + amount, 0);
  const totalCredits = Object.values(accountBalances).filter(amount => amount < 0).reduce((acc, amount) => acc - amount, 0);

  return (
    <Paper className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Trial Balance
      </Typography>
      <Divider className={styles.divider} />
      <div className={styles.entries}>
        {Object.entries(accountBalances).map(([account, balance], index) => (
          <div key={index} className={styles.entry}>
            <span>{account}</span>
            <span>{balance >= 0 ? `Debit: $${balance.toFixed(2)}` : `Credit: $${Math.abs(balance).toFixed(2)}`}</span>
          </div>
        ))}
      </div>
      <Divider className={styles.divider} />
      <div className={styles.results}>
        <Typography variant="body1">Total Debits: ${totalDebits.toFixed(2)}</Typography>
        <Typography variant="body1">Total Credits: ${totalCredits.toFixed(2)}</Typography>
        <Typography variant="body1" style={{ color: totalDebits === totalCredits ? 'green' : 'red' }}>
          {totalDebits === totalCredits ? 'Balanced' : 'Not Balanced'}
        </Typography>
      </div>
    </Paper>
  );
};

export default BalancingAccounts;
