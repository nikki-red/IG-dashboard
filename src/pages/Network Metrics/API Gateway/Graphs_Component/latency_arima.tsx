import { Box, Paper, Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

export default function LatencyArima() {
  const [arimaData, setArimaData] = useState([]);

  // Add this useEffect for ARIMA data
  useEffect(() => {
    fetch('/src/assets/Network_Graphs/API_Gateway_Graphs/Latency_ARIMA_Forecast.csv')
      .then((response) => response.text())
      .then((csvData) => {
        const rows = csvData.split('\n').slice(1);
        const parsedData = rows
          .filter(row => row.trim())
          .map((row) => {
            // Remove quotes and split by comma
            const values = row.replace(/"/g, '').split(',');

            return {
              timestamp: new Date(values[0]),
              historical: values[1] ? parseFloat(values[1]) : null,
              forecast: values[2] ? parseFloat(values[2]) : null,
              upperBound: values[3] ? parseFloat(values[3]) : null,
              lowerBound: values[4] ? parseFloat(values[4]) : null
            };
          })
          .filter(d => !isNaN(d.timestamp));
        setArimaData(parsedData);
      })
      .catch(error => console.error('Error loading ARIMA forecast data:', error));
  }, []);

  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ mb: 4 }}>
          <Tooltip
            title={
              <Box>
                <Typography variant="body2">Model: QuickSight-ARIMA</Typography>
                <Typography variant="body2">Date Range: Jan-07 - Jan-08</Typography>
              </Box>
            }
            arrow
            placement="right"
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
              - T5 Forecasting
            </Typography>
          </Tooltip>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              bgcolor: '#ffffff',
              borderRadius: 1,
              '&:hover': {
                boxShadow: 3,
                transition: 'box-shadow 0.3s ease-in-out'
              }
            }}
          >
            <Plot
              data={[
                // Historical Values
                {
                  x: arimaData.filter(d => d.historical !== null).map(d => d.timestamp),
                  y: arimaData.filter(d => d.historical !== null).map(d => d.historical),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Historical Data',
                  line: { color: '#2c3e50', width: 1 }
                },
                // Forecast Values
                {
                  x: arimaData.filter(d => d.forecast !== null).map(d => d.timestamp),
                  y: arimaData.filter(d => d.forecast !== null).map(d => d.forecast),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'ARIMA Forecast',
                  line: { color: '#e74c3c', width: 2 }
                },
                // Confidence Interval
                {
                  x: arimaData.filter(d => d.forecast !== null)
                    .map(d => d.timestamp)
                    .concat(arimaData.filter(d => d.forecast !== null)
                      .map(d => d.timestamp)
                      .reverse()),
                  y: arimaData.filter(d => d.forecast !== null)
                    .map(d => d.upperBound)
                    .concat(arimaData.filter(d => d.forecast !== null)
                      .map(d => d.lowerBound)
                      .reverse()),
                  fill: 'toself',
                  fillcolor: 'rgba(231, 76, 60, 0.2)',
                  line: { color: 'transparent' },
                  name: '95% Confidence Interval',
                  showlegend: true,
                  type: 'scatter'
                }
              ]}
              layout={{
                autosize: true,
                height: 500,
                margin: { l: 60, r: 30, t: 30, b: 50 },
                showlegend: true,
                xaxis: {
                  title: 'Time',
                  tickformat: '%Y-%m-%d %H:%M',
                  tickangle: -45,
                  gridcolor: '#e5e5e5',
                  zeroline: false,
                  range: [
                    new Date('2024-01-01'),  // Adjust range as needed
                    new Date('2024-01-08')
                  ]
                },
                yaxis: {
                  title: 'Latency (ms)',
                  gridcolor: '#e5e5e5',
                  zeroline: false
                },
                legend: {
                  x: 0.5,
                  y: 1.1,
                  orientation: 'h',
                  xanchor: 'center'
                },
                plot_bgcolor: 'white',
                paper_bgcolor: 'white'
              }}
              config={{
                responsive: true,
                displayModeBar: false
              }}
              style={{ width: '100%', height: '100%' }}
            />
          </Paper>
        </Box>
      </Grid>
    </>
  );
}