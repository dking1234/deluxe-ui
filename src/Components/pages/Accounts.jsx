import { Grid, Paper } from '@mui/material';
import ProfitLoss from '../ProfitLoss/ProfitLoss';
import BalancingAccounts from '../BalancingAccounts/BalancingAccounts';
import FinancialStatements from '../FinancialStatements/FinancialStatements'
import { useState } from 'react';

const Accounts = () => {

  const [ledger, setLedger] = useState([]);

  return (
    <div>
         <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ProfitLoss ledger={ledger} setLedger={setLedger} />
        </Grid>
        <Grid item xs={12} md={6}>
          <BalancingAccounts ledger={ledger} />
        </Grid>
        <Grid item xs={12} md={4}>
          <FinancialStatements ledger={ledger} />
        </Grid>
      </Grid>
    </div>
  )
}

export default Accounts