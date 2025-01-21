import { Typography, Paper, Grid, Box, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

export default function Team5_LSTMForecast() {
  const [datateam5, setDatateam5] = useState([]);
  const [t5Data, setT5Data] = useState([]);

  useEffect(() => {
    const fetchT5Data = async () => {
      try {
        const response = await fetch('/src/assets/Infrastructure_Graphs/team5/CPU_LSTM_team5_Forecast.csv');
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1); // Skip header row
        const parsedData = rows
          .filter(row => row.trim()) // Filter out empty rows
          .map(row => {
            const [Timestamp, CPUUtilization_actual, CPUUtilization_pred] = row.split(',');
            return {
              Timestamp,
              CPUUtilization_actual: parseFloat(CPUUtilization_actual),
              CPUUtilization_pred: parseFloat(CPUUtilization_pred)
            };
          })
          .filter(row => !isNaN(row.CPUUtilization_actual) && !isNaN(row.CPUUtilization_pred));
        setT5Data(parsedData);
      } catch (error) {
        console.error('Error loading T5 data:', error);
      }
    };

    fetchT5Data();
  }, []);

  useEffect(() => {
    fetch('/src/assets/Infrastructure_Graphs/team5/CPU_LSTM_team5_Actual+Predict.csv')
      .then((response) => response.text())
      .then((csvData) => {
        const rows = csvData.split('\n');
        const parsedData = rows
          .slice(1)
          .filter(row => row.trim())
          .map(row => {
            const [timestamp, cpu, predicted] = row.split(',');
            return {
              timestamp: new Date(timestamp),
              cpu: parseFloat(cpu),
              predicted: parseFloat(predicted)
            };
          });
        setDatateam5(parsedData);
      })
      .catch(error => console.error('Error loading data:', error));
  }, []);

  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ mb: 4 }}>
          <Tooltip 
            title={
              <Box>
                <Typography variant="body2">Model: LSTM</Typography>
                <Typography variant="body2">Date Range: Dec-06 - Dec-18</Typography>
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
                  x: datateam5.map(d => d.timestamp),
                  y: datateam5.map(d => d.cpu),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'CPU Utilization',
                  line: { color: '#8884d8' },
                  hovertemplate:
                    'CPU: %{y:.2f}%<br>' +
                    'Time: %{x}<br>'
                },
                {
                  x: datateam5.map(d => d.timestamp),
                  y: datateam5.map(d => d.predicted),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Predicted CPU Utilization',
                  line: { color: '#82ca9d' },
                  hovertemplate:
                    'CPU: %{y:.2f}%<br>' +
                    'Time: %{x}<br>'
                }
              ]}
              layout={{
                autosize: true,
                height: 400,
                margin: { l: 50, r: 30, t: 20, b: 50 },
                showlegend: true,
                xaxis: {
                  title: 'Time',
                  tickangle: -45
                },
                yaxis: {
                  title: 'CPU Utilization (%)',
                  titlefont: { color: '#1a1a1a' },
                  tickfont: { color: '#1a1a1a' },
                  range: [0, Math.max(
                    ...datateam5.map(d => d.cpu),
                    ...datateam5.map(d => d.predicted)
                  ) * 1.1] // Add 10% padding to the top
                },
                legend: {
                  x: 0.5,
                  y: 1.2,
                  orientation: 'h',
                  xanchor: 'center'
                }
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

      <Grid item xs={12}>
        <Box sx={{ mb: 4 }}>
          <Tooltip 
            title={
              <Box>
                <Typography variant="body2">Model: LSTM</Typography>
                <Typography variant="body2">Date Range: Dec-06 - Dec-18</Typography>
              </Box>
            } 
            arrow placement="right"
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
              - T5 Forecasting - Actual vs Predicted
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
                  x: t5Data.map(d => d.Timestamp),
                  y: t5Data.map(d => d.CPUUtilization_actual),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'CPU Utilization',
                  line: { color: '#C6C5D8' }
                },
                {
                  x: t5Data.map(d => d.Timestamp),
                  y: t5Data.map(d => d.CPUUtilization_pred),
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Predicted CPU Utilization',
                  line: { color: '#D16BA2' }
                }
              ]}
              layout={{
                autosize: true,
                height: 400,
                margin: { l: 50, r: 30, t: 20, b: 50 },
                showlegend: true,
                xaxis: {
                  title: 'Time',
                  tickangle: -45,
                  tickformat: '%Y-%m-%d %H:%M',
                  type: 'date'
                },
                yaxis: {
                  title: 'CPU Utilization (%)',
                  titlefont: { color: '#1a1a1a' },
                  tickfont: { color: '#1a1a1a' },
                  range: [0, Math.max(
                    ...t5Data.map(d => d.CPUUtilization_actual),
                    ...t5Data.map(d => d.CPUUtilization_pred)
                  ) * 1.1] // Add 10% padding to the top
                },
                legend: {
                  x: 0.5,
                  y: 1.2,
                  orientation: 'h',
                  xanchor: 'center'
                }
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