import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Paper, Typography } from '@mui/material';
import styles from './Analytics.module.css';

const Analytics = () => {
  const data = [
    { month: 'Jan', sales: 100 },
    { month: 'Feb', sales: 200 },
    { month: 'Mar', sales: 150 },
    { month: 'Apr', sales: 300 },
    { month: 'May', sales: 250 },
    { month: 'Jun', sales: 400 },
    { month: 'Jul', sales: 30 },
    { month: 'Aug', sales: 800 },
    { month: 'Sep', sales: 700 },
    { month: 'Oct', sales: 399 },
    { month: 'Nov', sales: 1000 },
    { month: 'Dec', sales: 600 }
  ];

  return (
    <Paper className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Sales Analytics
      </Typography>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="darkblue" stopOpacity={0.5} />
                <stop offset="100%" stopColor="darkblue" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="sales" stroke="darkblue" fill="url(#colorSales)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
};

export default Analytics;
