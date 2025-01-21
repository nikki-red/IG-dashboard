import React, { useEffect, useState } from 'react';
import { Box, Grid, Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import { Paper } from '@mui/material';
import Plot from 'react-plotly.js';

export default function LatencyClaude() {
  const [timelineData, setTimelineData] = useState([]);

  // Add this useEffect
  useEffect(() => {
    fetch('/src/assets/Network_Graphs/API_Gateway_Graphs/Latency_Claude_Forecast.csv')
      .then((response) => response.text())
      .then((csvData) => {
        console.log('Claude data');
        console.log(csvData);
        const rows = csvData.split('\n').slice(1);
        const parsedData = rows
          .filter(row => row.trim())
          .map((row) => {
            const [timestamp, value, type] = row.split(',');
            return {
              timestamp: new Date(timestamp),
              value: parseFloat(value),
              type: type.trim()
            };
          })
          // .filter(d => !isNaN(d.value));
          .filter(d => {
            // Filter for hourly data points (minutes and seconds are 0)
            const date = new Date(d.timestamp);
            return date.getMinutes() === 0 && date.getSeconds() === 0;
          });
        setTimelineData(parsedData);
      })
      .catch(error => console.error('Error loading timeline data:', error));
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
                // Actual Values
                {
                  x: timelineData
                    .filter(d => d.type === 'actual')
                    .map(d => d.timestamp),
                  y: timelineData
                    .filter(d => d.type === 'actual')
                    .map(d => d.value),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Actual Values',
                  line: { color: '#2c3e50', width: 1 }
                },
                // Predicted Values
                {
                  x: timelineData
                    .filter(d => d.type === 'predicted')
                    .map(d => d.timestamp),
                  y: timelineData
                    .filter(d => d.type === 'predicted')
                    .map(d => d.value),
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Predicted Values',
                  line: { color: '#A8A209', width: 2 },
                  marker: { size: 8 }
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
                  dtick: 3600000 * 6, // Show tick every 6 hours
                  range: [
                    new Date('2024-01-01 12:00:00'),  // Last day of actual data
                    new Date('2024-01-08 00:00:00')   // End of predictions
                  ]
                },
                yaxis: {
                  title: 'Latency (ms)',
                  gridcolor: '#e5e5e5',
                  zeroline: false,
                  range: [0, 350]  // Based on data range
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

