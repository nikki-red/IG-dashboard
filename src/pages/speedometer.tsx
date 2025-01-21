import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import ReactSpeedometer from 'react-d3-speedometer';

const Speedometer = ({ currentValue }) => {
  return (
        <Paper elevation={2} sx={{ p: 2, bgcolor: '#ffffff' }}>
          <Typography variant="h6" gutterBottom>
            CPU Utilization Speedometer
          </Typography>
          <ReactSpeedometer
            maxValue={100}
            value={currentValue}
            needleColor="steelblue"
            startColor="green"
            segments={10}
            endColor="red"
            needleTransitionDuration={4000}
            needleTransition="easeElastic"
            currentValueText="Current Value: ${value}%"
            textColor="#000000"
          />
        </Paper>
  );
};

export default Speedometer;