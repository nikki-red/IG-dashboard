import { Box, Paper, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import Plot from 'react-plotly.js';
import LambdaInsights from '../Insights_Component/lambda_insights';
import LambdaTable from '../Table_Component/lambda_table';

export default function AnomalyDetectionIsolationForest() {
  const [classifiedData, setClassifiedData] = useState([]);
  useEffect(() => {
    fetch('/src/assets/Network_Graphs/Lambda_Graphs/Lambda_Isolation_Forest.csv')
      .then(response => response.text())
      .then(csv => {
        console.log(csv)
        const rows = csv.split('\n').slice(1);
        const parsed = rows
          .filter(row => row.trim())
          .map(row => {
            const [
              startTime, invocations, errors, throttles,
              errorRate, hour, minute, errorRateScaled,
              invocationsScaled, anomaly, peakHourStatus
            ] = row.split(',');
            return {
              startTime: new Date(startTime),
              invocations: parseFloat(invocations),
              errors: parseFloat(errors),
              errorRate: parseFloat(errorRate),
              anomaly: parseInt(anomaly),
              peakHourStatus: peakHourStatus.trim(),
              hour: parseInt(hour)
            };
          });
        setClassifiedData(parsed);
      });
  }, []);
  // Sort data by hour for the second graph
  const hourlyData = [...Array(24)].map((_, hour) => {
    const hourData = classifiedData.filter(d => d.hour === hour);
    return {
      hour,
      invocations: hourData.reduce((sum, d) => sum + d.invocations, 0),
      peakHourStatus: hourData[0]?.peakHourStatus || 'Non-Peak Hours'
    };
  });

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Box sx={{ mb: 4 }}>
            <Tooltip
              title={
                <Box>
                  <Typography variant="body2">Model: Isolation Forest</Typography>
                  <Typography variant="body2">Date Range: Oct-12 - Nov-29</Typography>
                </Box>
              }
              arrow
              placement="left"
            >
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  color: '#1976d2',
                  fontWeight: 600,
                  cursor: 'default',
                  ml: 2
                }}
              >
                - T5 Lambda Invocations & Anomaly Detection
              </Typography>
            </Tooltip>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                bgcolor: '#ffffff',
                borderRadius: 1,
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: 3,
                  transition: 'box-shadow 0.3s ease-in-out'
                }
              }}
            >
              <Plot
                data={[
                  {
                    x: classifiedData.map(d => d.startTime),
                    y: classifiedData.map(d => d.invocations),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'Invocations',
                    line: { color: '#2c3e50', width: 1 },
                    marker: { size: 6 }
                  },
                  {
                    x: classifiedData.filter(d => d.anomaly === -1).map(d => d.startTime),
                    y: classifiedData.filter(d => d.anomaly === -1).map(d => d.invocations),
                    type: 'scatter',
                    mode: 'markers',
                    name: 'Anomalies',
                    marker: {
                      color: '#e74c3c',
                      size: 12,
                      symbol: 'star'
                    }
                  }
                ]}
                layout={{
                  height: 300,
                  width: 500,
                  margin: { l: 60, r: 30, t: 30, b: 50 },
                  showlegend: true,
                  legend: {
                    orientation: 'h', // Horizontal orientation
                    x: 0.5, // Center horizontally
                    xanchor: 'center', // Anchor the center of the legend
                    y: 1.1, // Position it above the plot area
                    yanchor: 'bottom', // Align the bottom of the legend at y
                  },
                  xaxis: {
                    title: 'Time',
                    tickformat: '%Y-%m-%d %H:%M',
                    tickangle: -45
                  },
                  yaxis: {
                    title: 'Number of Invocations',
                    type: 'log'
                  }
                }}
              />
            </Paper>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ mb: 4 }}>
            <Tooltip
              title={
                <Box>
                  <Typography variant="body2">Model: Isolation Forest</Typography>
                  <Typography variant="body2">Date Range: Oct-12 - Nov-29</Typography>
                </Box>
              }
              arrow
              placement="left"
            >
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  color: '#1976d2',
                  fontWeight: 600,
                  cursor: 'default',
                  ml: 2
                }}
              >
                - T5 Hourly Invocation Distribution
              </Typography>
            </Tooltip>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                bgcolor: '#ffffff',
                borderRadius: 1,
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: 3,
                  transition: 'box-shadow 0.3s ease-in-out'
                }
              }}
            >

              <Plot
                data={[
                  {
                    x: hourlyData.filter(d => d.peakHourStatus === 'Peak Hours').map(d => d.hour),
                    y: hourlyData.filter(d => d.peakHourStatus === 'Peak Hours').map(d => d.invocations),
                    type: 'bar',
                    name: 'Peak Hours',
                    marker: { color: '#e74c3c' }
                  },
                  {
                    x: hourlyData.filter(d => d.peakHourStatus === 'Non-Peak Hours').map(d => d.hour),
                    y: hourlyData.filter(d => d.peakHourStatus === 'Non-Peak Hours').map(d => d.invocations),
                    type: 'bar',
                    name: 'Non-Peak Hours',
                    marker: { color: '#3498db' }
                  }
                ]}
                layout={{
                  height: 300,
                  width: 500,
                  margin: { l: 60, r: 30, t: 30, b: 50 },
                  showlegend: true,
                  legend: {
                    orientation: 'h', // Horizontal orientation
                    x: 0.5, // Center horizontally
                    xanchor: 'center', // Anchor the center of the legend
                    y: 1.1, // Position it above the plot area
                    yanchor: 'bottom', // Align the bottom of the legend at y
                  },
                  barmode: 'group',
                  xaxis: {
                    title: 'Hour of Day',
                    tickmode: 'linear',
                    tick0: 0,
                    dtick: 1
                  },
                  yaxis: {
                    title: 'Total Invocations',
                    type: 'log'
                  }
                }}
              />
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <LambdaTable classifiedData={classifiedData} />
    </>
  );
}
