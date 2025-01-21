import { React, useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Tooltip } from '@mui/material';
import Plot from 'react-plotly.js';

export default function TSAS_LSTMForecast() {
  const [data, setData] = useState([]);
  const [lstmValidationData, setLstmValidationData] = useState([]); // For LSTM validation

  useEffect(() => {
    // Load both CSV files
    Promise.all([
      fetch('/src/assets/Infrastructure_Graphs/TSAS/CPU_LSTM_TSAS_Actual+Predict.csv'),
      fetch('/src/assets/Infrastructure_Graphs/TSAS/CPU_LSTM_TSAS_Reason.csv')
    ])
      .then(([metricsResponse, reasonsResponse]) => {
        if (!metricsResponse.ok || !reasonsResponse.ok) {
          throw new Error(`HTTP error! status: ${metricsResponse.status} ${reasonsResponse.status}`);
        }
        console.log('URLs are correct');
        return Promise.all([metricsResponse.text(), reasonsResponse.text()]);
      })
      .then(([metricsData, reasonsData]) => {
        // Create a map of timestamps to reasons
        const reasonsMap = new Map();
        const reasonRows = reasonsData.split('\n').slice(1);
        reasonRows
          .filter(row => row.trim())
          .forEach(row => {
            const columns = row.split(',');
            const timestamp = columns[0].trim(); // Last column is timestamp
            const reason = columns[columns.length - 1].trim();    // Second to last is reason
            reasonsMap.set(timestamp, reason);
          });

        // Parse metrics data and combine with reasons
        const rows = metricsData.split('\n');
        const parsedData = rows
          .slice(1)
          .filter(row => row.trim())
          .map(row => {
            const [timestamp, cpu, predicted] = row.split(',');
            return {
              timestamp: new Date(timestamp),
              cpu: parseFloat(cpu),
              predicted: parseFloat(predicted),
              reason: reasonsMap.get(timestamp) || '' // Add reason if exists, empty string if not
            };
          });

        setData(parsedData);
      })
      .catch(error => console.error('Error loading data:', error));
  }, []);

  useEffect(() => {
    // Load LSTM validation data
    fetch('/src/assets/Infrastructure_Graphs/TSAS/CPU_LSTM_TSAS_Forecast_Validation_nov21_dec7.csv')
      .then((response) => response.text())
      .then((csvData) => {

        const rows = csvData.split('\n');
        const parsedData = rows
          .slice(1)
          .filter(row => row.trim())
          .map((row) => {
            const [timestamp, cpu, predicted] = row.split(',');
            return {
              timestamp: new Date(timestamp),
              cpu: parseFloat(cpu),
              predicted: parseFloat(predicted)
            };
          });
        setLstmValidationData(parsedData);
      })
      .catch(error => console.error('Error loading LSTM validation data:', error));
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        {/* LSTM Forecasting - Nov-21 - Dec-07 */}
        <Grid item xs={12}>
          <Box sx={{ mb: 4 }}>
            <Tooltip 
              title={
                <Box>
                  <Typography variant="body2">Model: LSTM</Typography>
                  <Typography variant="body2">Date Range: Nov-21 - Dec-07</Typography>
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
                - TSAS Forecasting
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
                    x: data.map(d => d.timestamp),
                    y: data.map(d => d.cpu),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'CPU Utilization',
                    line: { color: '#8884d8' },
                    hovertemplate:
                      'CPU: %{y:.2f}%<br>' +
                      'Time: %{x}<br>' +
                      '%{text}<extra></extra>',
                    hoverlabel: {
                      bgcolor: '#FFA07A',
                      font: { color: 'white' }
                    },
                    text: data.map(d => d.reason ? `Reason: ${d.reason}` : '')
                  },
                  {
                    x: data.map(d => d.timestamp),
                    y: data.map(d => d.predicted),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Predicted CPU Utilization',
                    line: { color: '#82ca9d' },
                    hovertemplate:
                      'CPU: %{y:.2f}%<br>' +
                      'Time: %{x}<br>' +
                      '%{text}<extra></extra>',
                    hoverlabel: {
                      bgcolor: '#FFA07A',
                      font: { color: 'white' }
                    },
                    text: data.map(d => d.reason ? `Reason: ${d.reason}` : '')
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
                      ...data.map(d => d.cpu),
                      ...data.map(d => d.predicted)
                    ) * 1.1]
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
        {/* LSTM Forecasting - Nov-21 - Dec-07 - Actual vs Predicted */}
        <Grid item xs={12}>
          <Box sx={{ mb: 4 }}>
            <Tooltip 
              title={
                <Box>
                  <Typography variant="body2">Model: LSTM</Typography>
                  <Typography variant="body2">Date Range: Nov-21 - Dec-07</Typography>
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
                - TSAS Forecasting - Actual vs Predicted
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
                    x: lstmValidationData.map(d => d.timestamp),
                    y: lstmValidationData.map(d => d.cpu),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'CPU Utilization',
                    line: { color: '#C6C5D8' }
                  },
                  {
                    x: lstmValidationData.map(d => d.timestamp),
                    y: lstmValidationData.map(d => d.predicted),
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
                    tickangle: -45
                  },
                  yaxis: {
                    title: 'CPU Utilization (%)',
                    titlefont: { color: '#1a1a1a' },
                    tickfont: { color: '#1a1a1a' }
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
      </Grid>
    </>
  );
}

