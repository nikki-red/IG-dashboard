import { Paper } from '@mui/material';
import { Typography } from '@mui/material';
import { Grid } from '@mui/material';
import React from 'react';

export default function LatencyStats({ stats }) {
  return (
    <>
      <Grid item xs={12} gutterBottom>
        <Paper elevation={2} sx={{
          p: 2, bgcolor: '#f5f5f5',
          '&:hover': { boxShadow: 3 }
        }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#2196f3' }}>
            System Analysis
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">Total Data Points</Typography>
              <Typography variant="body1">{stats.total}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">Anomalies Detected</Typography>
              <Typography variant="body1">{stats.anomalies} ({stats.anomalyRate}%)</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">Average Latency</Typography>
              <Typography variant="body1">{stats.avgLatency} ms</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">Average Requests/5min</Typography>
              <Typography variant="body1">{stats.avgRequests}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
}