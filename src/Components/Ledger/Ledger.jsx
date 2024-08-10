import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Grid, Divider } from '@mui/material';
import styles from './Ledger.module.css';

const Ledger = () => {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [salesItem, setSalesItem] = useState('');
  const [salesAmount, setSalesAmount] = useState('');
  const [purchasesItem, setPurchasesItem] = useState('');
  const [purchasesAmount, setPurchasesAmount] = useState('');

  const handleAddSales = () => {
    if (salesItem && salesAmount) {
      setSales([...sales, { item: salesItem, amount: parseFloat(salesAmount) }]);
      setSalesItem('');
      setSalesAmount('');
    }
  };

  const handleAddPurchases = () => {
    if (purchasesItem && purchasesAmount) {
      setPurchases([...purchases, { item: purchasesItem, amount: parseFloat(purchasesAmount) }]);
      setPurchasesItem('');
      setPurchasesAmount('');
    }
  };

  const totalSales = sales.reduce((acc, item) => acc + item.amount, 0);
  const totalPurchases = purchases.reduce((acc, item) => acc + item.amount, 0);
  const balance = totalSales - totalPurchases;

  return (
    <Paper className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Ledger
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={styles.sectionTitle}>
            Add Sales
          </Typography>
          <TextField
            label="Item Name"
            value={salesItem}
            onChange={(e) => setSalesItem(e.target.value)}
            className={styles.input}
          />
          <TextField
            label="Amount"
            type="number"
            value={salesAmount}
            onChange={(e) => setSalesAmount(e.target.value)}
            className={styles.input}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSales}
            className={styles.button}
          >
            Add Sale
          </Button>
          <Divider className={styles.divider} />
          <Typography variant="h6" className={styles.sectionTitle}>
            Add Purchases
          </Typography>
          <TextField
            label="Item Name"
            value={purchasesItem}
            onChange={(e) => setPurchasesItem(e.target.value)}
            className={styles.input}
          />
          <TextField
            label="Amount"
            type="number"
            value={purchasesAmount}
            onChange={(e) => setPurchasesAmount(e.target.value)}
            className={styles.input}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPurchases}
            className={styles.button}
          >
            Add Purchase
          </Button>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={styles.sectionTitle}>
            View Sales
          </Typography>
          <div className={styles.entries}>
            {sales.map((entry, index) => (
              <div key={index} className={styles.entry}>
                <span>{entry.item}</span>
                <span>${entry.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <Divider className={styles.divider} />
          <Typography variant="h6" className={styles.sectionTitle}>
            View Purchases
          </Typography>
          <div className={styles.entries}>
            {purchases.map((entry, index) => (
              <div key={index} className={styles.entry}>
                <span>{entry.item}</span>
                <span>${entry.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
      
      <div className={styles.results}>
        <Typography variant="body1">Total Sales: ${totalSales.toFixed(2)}</Typography>
        <Typography variant="body1">Total Purchases: ${totalPurchases.toFixed(2)}</Typography>
        <Typography variant="body1">Balance: ${balance.toFixed(2)}</Typography>
      </div>
    </Paper>
  );
};

export default Ledger;
