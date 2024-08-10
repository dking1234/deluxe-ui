import React from 'react';
import { Paper, Typography, Divider } from '@mui/material';
import styles from './FinancialStatements.module.css';

const FinancialStatements = ({ ledger }) => {
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

  const generateBalanceSheet = (accountBalances) => {
    const assets = [];
    const liabilities = [];
    const equity = [];

    Object.entries(accountBalances).forEach(([account, balance]) => {
      if (balance >= 0) {
        assets.push({ account, balance });
      } else {
        liabilities.push({ account, balance: Math.abs(balance) });
      }
    });

    const totalAssets = assets.reduce((acc, asset) => acc + asset.balance, 0);
    const totalLiabilities = liabilities.reduce((acc, liability) => acc + liability.balance, 0);
    const totalEquity = totalAssets - totalLiabilities;

    equity.push({ account: 'Retained Earnings', balance: totalEquity });

    return { assets, liabilities, equity };
  };

  const accountBalances = calculateBalances();
  const balanceSheet = generateBalanceSheet(accountBalances);

  return (
    <Paper className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Financial Statements
      </Typography>
      
      <Divider className={styles.divider} />
      <Typography variant="h6" className={styles.sectionTitle}>
        Balance Sheet
      </Typography>
      
      <Typography variant="subtitle1" className={styles.subTitle}>Assets</Typography>
      <div className={styles.entries}>
        {balanceSheet.assets.map((asset, index) => (
          <div key={index} className={styles.entry}>
            <span>{asset.account}</span>
            <span>${asset.balance.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <Typography variant="body1">Total Assets: ${balanceSheet.assets.reduce((acc, asset) => acc + asset.balance, 0).toFixed(2)}</Typography>
      
      <Divider className={styles.divider} />
      <Typography variant="subtitle1" className={styles.subTitle}>Liabilities</Typography>
      <div className={styles.entries}>
        {balanceSheet.liabilities.map((liability, index) => (
          <div key={index} className={styles.entry}>
            <span>{liability.account}</span>
            <span>${liability.balance.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <Typography variant="body1">Total Liabilities: ${balanceSheet.liabilities.reduce((acc, liability) => acc + liability.balance, 0).toFixed(2)}</Typography>
      
      <Divider className={styles.divider} />
      <Typography variant="subtitle1" className={styles.subTitle}>Equity</Typography>
      <div className={styles.entries}>
        {balanceSheet.equity.map((eq, index) => (
          <div key={index} className={styles.entry}>
            <span>{eq.account}</span>
            <span>${eq.balance.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <Typography variant="body1">Total Equity: ${balanceSheet.equity.reduce((acc, eq) => acc + eq.balance, 0).toFixed(2)}</Typography>
    </Paper>
  );
};

export default FinancialStatements;
