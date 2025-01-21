import { Typography, Paper, Grid, Box, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

export default function TSAS_ARIMAForecast() {
    const [forecastData, setForecastData] = useState([]); // For forecast with bounds
    const [quicksightValidationData, setQuicksightValidationData] = useState([]); // For forecast vs actual

    useEffect(() => {
        fetch('/src/assets/Infrastructure_Graphs/TSAS/CPU_QuicksightARIMA_Forecast_dec1_dec7.csv')
          .then((response) => response.text())
          .then((csvData) => {
            const rows = csvData.split('\n').slice(1);
            const parsedData = rows
              .filter(row => row.trim())
              .map((row) => {
                // Remove all quotes and split by comma
                const values = row.replace(/"/g, '').split(',');
    
                // Check if this is a historical or forecast row based on the data pattern
                const timestamp = new Date(values[0]);
                const isHistoricalRow = values[1] && values[1].trim() !== '';
    
                return {
                  timestamp,
                  historical: isHistoricalRow ? parseFloat(values[1]) : null,
                  forecast: isHistoricalRow ? null : parseFloat(values[2]),
                  upperBound: isHistoricalRow ? null : parseFloat(values[3]),
                  lowerBound: isHistoricalRow ? null : parseFloat(values[4])
                };
              })
              .filter(d => !isNaN(d.timestamp));
            setForecastData(parsedData);
          })
          .catch(error => console.error('Error loading forecast data:', error));
      }, []);
      const historicalData = forecastData.filter(d => d.timestamp < new Date('2024-12-01'));
      const futureData = forecastData.filter(d => d.timestamp >= new Date('2024-12-01'));
    useEffect(() => {
        fetch('/src/assets/Infrastructure_Graphs/TSAS/CPU_QuicksightARIMA_Validation_dec1_dec7.csv')
            .then((response) => response.text())
            .then((csvData) => {
                const rows = csvData.split('\n').slice(1); // Skip header
                const parsedData = rows
                    .filter(row => row.trim())
                    .map((row) => {
                        const [timestamp, forecast, actual] = row.split(',');
                        return {
                            timestamp: new Date(timestamp.replace(/"/g, '')),
                            forecast: parseFloat(forecast),
                            actual: parseFloat(actual)
                        };
                    });
                setQuicksightValidationData(parsedData);
            })
            .catch(error => console.error('Error loading QuickSight validation data:', error));
    }, []);
    return (
        <>
            <Grid item xs={12}>
                <Box sx={{ mb: 4 }}>
                    <Tooltip 
                        title={
                            <Box>
                                <Typography variant="body2">Model: ARIMA</Typography>
                                <Typography variant="body2">Date Range: Dec-01 - Dec-07</Typography>
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
                            - Forecasting
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
                                // Historical Forecast (Oct 14 - Nov 30)
                                {
                                    x: historicalData.map(d => d.timestamp),
                                    y: historicalData.map(d => d.historical),
                                    type: 'scatter',
                                    mode: 'lines',
                                    name: 'Historical Forecast',
                                    line: { color: '#8884d8' }
                                },
                                // Future Forecast (Dec 1 - Dec 7)
                                {
                                    x: futureData.map(d => d.timestamp),
                                    y: futureData.map(d => d.forecast),
                                    type: 'scatter',
                                    mode: 'lines',
                                    name: 'Future Forecast',
                                    line: { color: '#ff7f0e' }
                                },
                                // Upper Bound for Future Period
                                {
                                    x: futureData.map(d => d.timestamp),
                                    y: futureData.map(d => d.upperBound),
                                    type: 'scatter',
                                    mode: 'lines',
                                    name: 'Confidence Interval',
                                    line: { width: 0 },
                                    showlegend: false
                                },
                                // Lower Bound for Future Period with Fill
                                {
                                    x: futureData.map(d => d.timestamp),
                                    y: futureData.map(d => d.lowerBound),
                                    type: 'scatter',
                                    mode: 'lines',
                                    fill: 'tonexty',
                                    fillcolor: 'rgba(255, 127, 14, 0.2)',
                                    line: { width: 0 },
                                    showlegend: false
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
                                    range: [
                                        new Date('2024-10-14'),
                                        new Date('2024-12-07')
                                    ]
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

            <Grid item xs={12}>
                <Box sx={{ mb: 4 }}>
                    <Tooltip 
                        title={
                            <Box>
                                <Typography variant="body2">Model: ARIMA</Typography>
                                <Typography variant="body2">Date Range: Dec-01 - Dec-07</Typography>
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
                            - Forecasting - Actual vs Predicted
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
                                    x: quicksightValidationData.map(d => d.timestamp),
                                    y: quicksightValidationData.map(d => d.actual),
                                    type: 'scatter',
                                    mode: 'lines',
                                    name: 'Actual CPU Utilization',
                                    line: { color: '#C6C5D8' }
                                },
                                {
                                    x: quicksightValidationData.map(d => d.timestamp),
                                    y: quicksightValidationData.map(d => d.forecast),
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
                                    tickfont: { color: '#1a1a1a' },
                                    range: [0, Math.max(
                                        ...quicksightValidationData.map(d => d.actual),
                                        ...quicksightValidationData.map(d => d.forecast)
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
        </>
    );
}