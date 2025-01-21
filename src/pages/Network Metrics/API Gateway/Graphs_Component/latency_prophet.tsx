import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Tooltip, Typography } from '@mui/material';
import Plot from 'react-plotly.js';

export default function LatencyProphet() {
  const [latencyProphetData, setLatencyProphetData] = useState([]);

  // Add this useEffect with your other useEffects
  useEffect(() => {
    fetch('/src/assets/Network_Graphs/API_Gateway_Graphs/Latency_Prophet_Actual+Predict.csv')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((csvData) => {
        console.log('CSV Data received:', csvData.substring(0, 200)); // Show first 200 chars

        const rows = csvData.split('\n').slice(1);
        const parsedData = rows
          .filter(row => row.trim())
          .map((row) => {
            const [timestamp, predicted, lower, upper, actual, requestCount, bandwidth, throughput, explanations] = row.split(',');
            const date = new Date(timestamp);

            // Only include predictions from Jan 7th 1am onwards
            const isPredictionTime = date >= new Date('2024-01-07 00:00:00');

            return {
              timestamp: date,
              predicted: isPredictionTime ? parseFloat(predicted) : null,
              lower: isPredictionTime ? parseFloat(lower) : null,
              upper: isPredictionTime ? parseFloat(upper) : null,
              actual: actual ? parseFloat(actual) : null,
              explanations: explanations
            };
          })
          // .filter(d => !isNaN(d.predicted));
          .filter(d => {
            // Filter for hourly data points (minutes and seconds are 0)
            const date = new Date(d.timestamp);
            return date.getMinutes() === 0 && date.getSeconds() === 0;
          });
        setLatencyProphetData(parsedData);
      })
      .catch(error => console.error('Error loading Prophet forecast data:', error));
  }, []);

  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ mb: 4 }}>
          <Tooltip
            title={
              <Box>
                <Typography variant="body2">Model: Prophet</Typography>
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
                {
                  x: latencyProphetData.map(d => d.timestamp),
                  y: latencyProphetData.map(d => d.actual),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Actual Latency',
                  line: { color: '#2c3e50', width: 1 },
                  hoverinfo: 'y+text',
                  text: latencyProphetData.map(d => d.explanations),
                  hoverlabel: {
                    bgcolor: '#FFA07A',
                    font: { color: 'white' }
                  },

                },
                // Predicted Values
                {
                  x: latencyProphetData.map(d => d.timestamp),
                  y: latencyProphetData.map(d => d.predicted),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Predicted Latency',
                  line: { color: '#ff7f0e', width: 2 }
                },
                // Confidence Interval
                {
                  x: latencyProphetData.map(d => d.timestamp).concat(latencyProphetData.map(d => d.timestamp).reverse()),
                  y: latencyProphetData.map(d => d.upper).concat(latencyProphetData.map(d => d.lower).reverse()),
                  fill: 'toself',
                  fillcolor: 'rgba(255, 127, 14, 0.2)',
                  line: { color: 'transparent' },
                  name: 'Confidence Interval',
                  showlegend: true,
                  type: 'scatter'
                }
              ]}
              layout={{
                autosize: true,
                height: 400,
                margin: { l: 60, r: 30, t: 30, b: 50 },
                showlegend: true,
                xaxis: {
                  title: 'Time',
                  tickformat: '%Y-%m-%d %H:%M',
                  tickangle: -45,
                  gridcolor: '#e5e5e5',
                  zeroline: false
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

