import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Grid, Divider } from '@mui/material';
import styles from './ProfitLoss.module.css';

const ProfitLoss = ({ ledger, setLedger }) => {
  const [entryDetails, setEntryDetails] = useState({
    transactionNumber: '',
    accountName: '',
    description: '',
    amount: '',
    type: 'debit'
  });

  const handleAddEntry = () => {
    const { transactionNumber, accountName, description, amount, type } = entryDetails;

    if (transactionNumber && accountName && description && amount && type) {
      setLedger([
        ...ledger,
        {
          transactionNumber,
          accountName,
          description,
          amount: parseFloat(amount),
          type
        }
      ]);

      setEntryDetails({
        transactionNumber: '',
        accountName: '',
        description: '',
        amount: '',
        type: 'debit'
      });
    }
  };

  return (
    <Paper className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Ledger
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={styles.sectionTitle}>
            Add Entry
          </Typography>
          <TextField
            label="Transaction Number"
            value={entryDetails.transactionNumber}
            onChange={(e) =>
              setEntryDetails({ ...entryDetails, transactionNumber: e.target.value })
            }
            className={styles.input}
          />
          <TextField
            label="Account Name"
            value={entryDetails.accountName}
            onChange={(e) =>
              setEntryDetails({ ...entryDetails, accountName: e.target.value })
            }
            className={styles.input}
          />
          <TextField
            label="Description"
            value={entryDetails.description}
            onChange={(e) =>
              setEntryDetails({ ...entryDetails, description: e.target.value })
            }
            className={styles.input}
          />
          <TextField
            label="Amount"
            type="number"
            value={entryDetails.amount}
            onChange={(e) =>
              setEntryDetails({ ...entryDetails, amount: e.target.value })
            }
            className={styles.input}
          />
          <TextField
            label="Type"
            select
            SelectProps={{
              native: true
            }}
            value={entryDetails.type}
            onChange={(e) =>
              setEntryDetails({ ...entryDetails, type: e.target.value })
            }
            className={styles.input}
          >
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddEntry}
            className={styles.button}
          >
            Add Entry
          </Button>
        </Grid>
      </Grid>

      <Divider className={styles.divider} />
      <Typography variant="h6" className={styles.sectionTitle}>
        Ledger Entries
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={styles.subTitle}>
            Debit
          </Typography>
          <div className={styles.entries}>
            {ledger
              .filter(entry => entry.type === 'debit')
              .map((entry, index) => (
                <div key={index} className={styles.entry}>
                  <span>{entry.transactionNumber}</span>
                  <span>{entry.accountName}</span>
                  <span>{entry.description}</span>
                  <span>${entry.amount.toFixed(2)}</span>
                </div>
              ))}
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={styles.subTitle}>
            Credit
          </Typography>
          <div className={styles.entries}>
            {ledger
              .filter(entry => entry.type === 'credit')
              .map((entry, index) => (
                <div key={index} className={styles.entry}>
                  <span>{entry.transactionNumber}</span>
                  <span>{entry.accountName}</span>
                  <span>{entry.description}</span>
                  <span>${entry.amount.toFixed(2)}</span>
                </div>
              ))}
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProfitLoss;
