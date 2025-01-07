import * as React from 'react';
import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Container, Paper, Grid, Select, MenuItem, ToggleButtonGroup, ToggleButton, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Plot from 'react-plotly.js';


export default function InfrastructureMetrics() {

  // Existing state
  const [ec2Instance, setEc2Instance] = useState('TSAS-StreamlitHost');
  const [apiType, setApiType] = useState('team5-credit-API');
  const [lambdaFunction, setLambdaFunction] = useState('team5-credit');
  const [ec2Models, setEc2Models] = useState(['LSTM']);
  const [apiModels, setApiModels] = useState(['KNN&Isolation Forest']);
  const [lambdaModels, setLambdaModels] = useState(['LSTM']);
  const [showModelEvaluation, setShowModelEvaluation] = useState(false); // State to control Model Evaluation visibility
  const [t5Data, setT5Data] = useState([]);

  // New state for active metrics
  const [activeMetric, setActiveMetric] = useState('infrastructure');

  // Add new state for insights
  const [insights, setInsights] = useState(null);
  const [data, setData] = useState([]);
  const [forecastData, setForecastData] = useState([]); // For forecast with bounds
  const [quicksightValidationData, setQuicksightValidationData] = useState([]); // For forecast vs actual
  const [apiGatewayInsights, setApiGatewayInsights] = useState(null);
  const [ec2Insights, setEc2Insights] = useState(null);
  const [lstmValidationData, setLstmValidationData] = useState([]); // For LSTM validation
  const [latencyProphetData, setLatencyProphetData] = useState([]);
  const [arimaData, setArimaData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [anomalytimelineData, anomalysetTimelineData] = useState([]);
  const [stats, setStats] = useState({});
  const [classifiedData, setClassifiedData] = useState([]);

  useEffect(() => {
    const fetchT5Data = async () => {
      try {
        const response = await fetch('/CPU-Util-t5-complete.csv');
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
    fetch('/new.csv')
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
        setData(parsedData);
      })
      .catch(error => console.error('Error loading data:', error));
  }, []);

  useEffect(() => {
    // Load LSTM validation data
    fetch('/cpu_lstm_forecast_validation_nov21_dec7.csv')
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

  useEffect(() => {
    fetch('/cpu_quicksightarima_forecast_validation_dec1_dec7.csv')
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

  // Add this useEffect with your other useEffects
  useEffect(() => {
    fetch('/latency_prophet_forecast_jan07.csv')
      .then((response) => response.text())
      .then((csvData) => {
        const rows = csvData.split('\n').slice(1);
        const parsedData = rows
          .filter(row => row.trim())
          .map((row) => {
          //   const [timestamp, predicted, lower, upper, actual] = row.split(',');
          //   return {
          //     timestamp: new Date(timestamp),
          //     predicted: parseFloat(predicted),
          //     lower: parseFloat(lower),
          //     upper: parseFloat(upper),
          //     actual: actual ? parseFloat(actual) : null // Handle empty actual values
          //   };
          // })
          const [timestamp, predicted, lower, upper, actual] = row.split(',');
          const date = new Date(timestamp);
          
          // Only include predictions from Jan 7th 1am onwards
          const isPredictionTime = date >= new Date('2024-01-07 00:00:00');
          
          return {
            timestamp: date,
            predicted: isPredictionTime ? parseFloat(predicted) : null,
            lower: isPredictionTime ? parseFloat(lower) : null,
            upper: isPredictionTime ? parseFloat(upper) : null,
            actual: actual ? parseFloat(actual) : null
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

  // Add this useEffect for ARIMA data
  useEffect(() => {
    fetch('/latency_quicksightarima_forecast_jan07.csv')
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

  // Add this useEffect
  useEffect(() => {
    fetch('/complete_timeline_with_predictions (2).csv')
      .then((response) => response.text())
      .then((csvData) => {
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

  useEffect(() => {
    fetch('/anomaly_detection (1).csv')
      .then((response) => response.text())
      .then((csvData) => {
        const rows = csvData.split('\n').slice(1);
        const parsedData = rows
          .filter(row => row.trim())
          .map((row) => {
            const [timestamp, latency, requests, errorRate, isAnomaly] = row.split(',');
            return {
              timestamp: new Date(timestamp),
              latency: parseFloat(latency),
              requests: parseInt(requests),
              errorRate: parseFloat(errorRate),
              isAnomaly: parseInt(isAnomaly)
            };
          })
          .filter(d => !isNaN(d.latency));

        anomalysetTimelineData(parsedData);

        // Calculate statistics
        const anomalies = parsedData.filter(d => d.isAnomaly === 1);
        setStats({
          total: parsedData.length,
          anomalies: anomalies.length,
          anomalyRate: (anomalies.length / parsedData.length * 100).toFixed(1),
          avgLatency: (parsedData.reduce((sum, d) => sum + d.latency, 0) / parsedData.length).toFixed(1),
          avgRequests: Math.round(parsedData.reduce((sum, d) => sum + d.requests, 0) / parsedData.length)
        });
      });
  }, []);
    

  useEffect(() => {
      fetch('/classified_lambda_metrics_with_peak_hours_status_new (1).csv')
        .then(response => response.text())
        .then(csv => {
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



  useEffect(() => {
    const fetchApiGatewayInsights = async () => {
      try {
        const response = await fetch('https://iufi14jew0.execute-api.us-east-1.amazonaws.com/default/IG_API_insights');
        const data = await response.json();
        
        // Extract JSON from markdown code block
        const jsonString = data.insights
          .replace('```json\n', '')
          .replace('\n```', '')
          .trim();
        
        const parsedInsights = JSON.parse(jsonString);
        setApiGatewayInsights(parsedInsights);
      } catch (error) {
        console.error('Error fetching API Gateway insights:', error);
      }
    };
  
    fetchApiGatewayInsights();
  }, []);
  
  useEffect(() => {
    const fetchEc2Insights = async () => {
      try {
        const response = await fetch('https://fbdpo8kyjl.execute-api.us-east-1.amazonaws.com/default/y_ig_insights'); // Replace with your actual API URL
        const data = await response.json();
        const insightText = data.insights.completion.trim()
        // Log the completion string for debugging
        console.log('Completion String:', insightText);
  
        // Extract the insights text directly from the completion string
        //const insightsText = data.insights.completion.trim(); // Remove any extra whitespace
        setEc2Insights(insightText); // Set the insights text to state
      } catch (error) {
        console.error('Error fetching EC2 insights:', error);
      }
    };
  
    fetchEc2Insights();
  }, []);
  useEffect(() => {
    console.log('useEffect triggered');

    const fetchInsights = async () => {
      console.log('Starting fetch');
      try {
        const response = await fetch('https://fxza7y0toi.execute-api.us-east-1.amazonaws.com/default/IG_lambda_insights');
        const data = await response.json();
        console.log('Response data:', data);
        
        // Direct access to insights property
        if (data.insights) {
          console.log('Setting insights:', data.insights);
          setInsights(data.insights);
        } else {
          console.log('No insights found in response');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchInsights();
  }, []);
  
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, p: 2 }}>
          <Paper sx={{ p: 2, height: '100%', overflow: 'auto', bgcolor: '#f5f9ff' }}>
            <Select
              fullWidth
              value={ec2Instance}
              onChange={(e) => setEc2Instance(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="TSAS-StreamlitHost">TSAS-StreamlitHost</MenuItem>
              <MenuItem value="kidonteam5ec2">team5</MenuItem>
            </Select>
            
            <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
              {ec2Instance === 'TSAS-StreamlitHost' ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    TSAS-StreamlitHost Overview
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {/* Add your TSAS description here */}
                    Description about TSAS instance and its purpose...
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Instance Type:</strong> t3.2xlarge
                  </Typography>
                  <Typography variant="body2">
                    <strong>Region:</strong> usa-east-1
                  </Typography>
                  Instance ID: i-0001324e481555bb7
                  No of vCPUs: 8
                  Virtualization type: hvm
                  TSAT
                </>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    Team 5 EC2 Instance Overview
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {/* Add your Team 5 description here */}
                    Description about Team 5 instance and its purpose...
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Instance Type:</strong> t2.xlarge
                  </Typography>
                  <Typography variant="body2">
                    <strong>Region:</strong> ap-south-1
                  </Typography>
                  Instance ID: i-08a4986ef5bc41d72
                  No of vCPUs: 8
                  Virtualization type: hvm
                </>
              )}
            </Paper>

            <ToggleButtonGroup
              value={ec2Models}
              onChange={(e, newModels) => setEc2Models(newModels)}
              sx={{ mb: 2 }}
            >
              <ToggleButton value="LSTM">LSTM</ToggleButton>
              <ToggleButton value="ARIMA">ARIMA</ToggleButton>
              <ToggleButton value="Other">Other</ToggleButton>
            </ToggleButtonGroup>

            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography variant="subtitle1">CPU Utilization</Typography>
                <Grid container spacing={2}>
                  
                  {ec2Instance === 'TSAS-StreamlitHost' && ec2Models.includes('LSTM') && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">LSTM Forecasting - Nov-21 - Dec-07 </Typography>
                      
                      <Paper elevation={2} sx={{ p: 1, bgcolor: '#ffffff' }}>
                        <Plot
                          data={[
                            {
                              x: data.map(d => d.timestamp),
                              y: data.map(d => d.cpu),
                              type: 'scatter',
                              mode: 'lines',
                              name: 'CPU Utilization',
                              line: { color: '#8884d8' }
                            },
                            {
                              x: data.map(d => d.timestamp),
                              y: data.map(d => d.predicted),
                              type: 'scatter',
                              mode: 'lines',
                              name: 'Predicted CPU Utilization',
                              line: { color: '#82ca9d' }
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
                    </Grid>
                  )}

                  {ec2Instance === 'TSAS-StreamlitHost' && ec2Models.includes('LSTM') && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">LSTM Forecasting - Nov-21 - Dec-07 - Actual vs Predicted</Typography>
                      <Paper elevation={2} sx={{ p: 1, bgcolor: '#ffffff' }}>
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
                            margin: { l: 50, r: 50, t: 30, b: 30 },
                            xaxis: {
                              title: 'Time',
                              showgrid: true,
                              gridcolor: '#e1e1e1'
                            },
                            yaxis: {
                              title: 'CPU Utilization',
                              showgrid: true,
                              gridcolor: '#e1e1e1'
                            },
                            paper_bgcolor: 'white',
                            plot_bgcolor: 'white',
                            showlegend: true,
                            legend: {
                              x: 0,
                              y: 1
                            }
                          }}
                          config={{
                            responsive: true,
                            displayModeBar: false
                          }}
                          style={{ width: '100%' }}
                        />
                      </Paper>
                    </Grid>
                  )}

                  {ec2Instance === 'TSAS-StreamlitHost' && ec2Models.includes('ARIMA') && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">QuickSight ARIMA Forecasting - Dec-01 - Dec-07</Typography>
                      <Paper elevation={2} sx={{ p: 1, bgcolor: '#ffffff' }}>
                        <Plot
                          data={[
                            {
                              x: historicalData.map(d => d.timestamp),
                              y: historicalData.map(d => d.historical),
                              type: 'scatter',
                              mode: 'lines',
                              name: 'Historical Forecast',
                              line: { color: '#8884d8' }
                            },
                            {
                              x: futureData.map(d => d.timestamp),
                              y: futureData.map(d => d.forecast),
                              type: 'scatter',
                              mode: 'lines',
                              name: 'Future Forecast',
                              line: { color: '#ff7f0e' }
                            },
                            {
                              x: futureData.map(d => d.timestamp),
                              y: futureData.map(d => d.upperBound),
                              type: 'scatter',
                              mode: 'lines',
                              name: 'Confidence Interval',
                              line: { width: 0 },
                              showlegend: false
                            },
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
                    </Grid>
                  )}

                  {ec2Instance === 'TSAS-StreamlitHost' && ec2Models.includes('ARIMA') && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">QuickSight ARIMA Forecasting - Dec-01 - Dec-07 - Actual vs Predicted</Typography>
                      <Paper elevation={2} sx={{ p: 1, bgcolor: '#ffffff' }}>
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
                            margin: { l: 50, r: 50, t: 30, b: 30 },
                            xaxis: {
                              title: 'Time',
                              showgrid: true,
                              gridcolor: '#e1e1e1'
                            },
                            yaxis: {
                              title: 'CPU Utilization',
                              showgrid: true,
                              gridcolor: '#e1e1e1',
                              range: [0, Math.max(
                                ...quicksightValidationData.map(d => d.actual),
                                ...quicksightValidationData.map(d => d.forecast)
                              ) * 1.1]
                            },
                            paper_bgcolor: 'white',
                            plot_bgcolor: 'white',
                            showlegend: true,
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
                          style={{ width: '100%' }}
                        />
                      </Paper>
                    </Grid>
                  )}

                  {ec2Instance === 'kidonteam5ec2' && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">T5 Forecasting - Dec-06 - Dec-18</Typography>
                      <Paper elevation={2} sx={{ p: 1, bgcolor: '#ffffff' }}>
                        <Plot
                          data={[
                            {
                              x: t5Data.map(d => d.Timestamp),
                              y: t5Data.map(d => d.CPUUtilization_actual),
                              type: 'scatter',
                              mode: 'lines',
                              name: 'CPU Utilization',
                              line: { color: '#8884d8' }
                            },
                            {
                              x: t5Data.map(d => d.Timestamp),
                              y: t5Data.map(d => d.CPUUtilization_pred),
                              type: 'scatter',
                              mode: 'lines',
                              name: 'Predicted CPU Utilization',
                              line: { color: '#82ca9d' }
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
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 1 }}>EC2 Insights</Typography>
                    {ec2Insights ? (
                      ec2Insights.trim() ? (
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', p: 1, bgcolor: 'white', borderRadius: '4px' }}>
                          {ec2Insights}
                        </Typography>
                      ) : (
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          No insights available.
                        </Typography>
                      )
                    ) : (
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        Loading EC2 insights...
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
      </Box>
    </Box>
      
  )
}


