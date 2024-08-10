import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import styles from './StatCard.module.css';

const StatCard = ({ number, label, analytics, borderColor }) => {
  return (
    <Card className={styles.card}>
      <CardContent>
        <div className={styles.labelNumber} style={{ borderLeftColor: borderColor }}>
          <Typography variant="body1" color="textSecondary" className={styles.statLabel}>
            {label}
          </Typography>
          <Typography variant="h2" component="div" className={styles.statNumber}>
            {number}
          </Typography>
        </div>
        <Typography variant="body2" color="textSecondary" className={styles.analytics}>
          {analytics}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
