import * as React from 'react';
import { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, colors, Button, Drawer, Fab } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AppBar, Toolbar, Typography, Box, Container, Paper, Grid, Select, MenuItem, ToggleButtonGroup, ToggleButton, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Plot from 'react-plotly.js';
import GaugeChart from 'react-gauge-chart';
import ReactSpeedometer from "react-d3-speedometer";
import { ArcGauge } from '@progress/kendo-react-gauges';
import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Speedometer from './speedometer';
import Chatbot from './chat_bot';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';

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
  const currentDate = new Date().toLocaleDateString();
  const [showToggleButtons, setShowToggleButtons] = useState(false);

  const handleToggle = () => {
    setShowToggleButtons(!showToggleButtons);
  };

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
    // Load both CSV files
    Promise.all([
      fetch('/src/assets/TSAS_CPU_Actual+Predict.csv'),
      fetch('/src/assets/TSAS_CPU_Reason.csv')
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
            const timestamp = columns[columns.length - 1].trim(); // Last column is timestamp
            const reason = columns[columns.length - 2].trim();    // Second to last is reason
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
  /* this useffect works for TSAS_CPU_Actual+Predict.csv
    useEffect(() => {
      fetch('/src/assets/TSAS_CPU_Actual+Predict.csv')//'/new.csv')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        else {
          console.log('url is correct'); 
          return response.text();
        }
      })
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
  */

  // useEffect(() => {
  //   // Load both CSV files
  //   Promise.all([
  //     fetch('../assets/TSAS_CPU_Actual+Predict.csv'),
  //     fetch('../assets/TSAS_CPU_Reason.csv')
  //   ])
  //     .then(([metricsResponse, reasonsResponse]) => 
  //       Promise.all([metricsResponse.text(), reasonsResponse.text()])
  //     )
  //     .then(([metricsData, reasonsData]) => {
  //       // Parse metrics data
  //       const metricRows = metricsData.split('\n');
  //       const parsedMetrics = metricRows
  //         .slice(1)
  //         .filter(row => row.trim())
  //         .map(row => {
  //           const [timestamp, cpu, predicted] = row.split(',');
  //           return {
  //             timestamp: new Date(timestamp),
  //             cpu: parseFloat(cpu),
  //             predicted: parseFloat(predicted)
  //           };
  //         });

  //       // Parse reasons data
  //       const reasonRows = reasonsData.split('\n');
  //       const parsedReasons = reasonRows
  //         .slice(1)
  //         .filter(row => row.trim())
  //         .map(row => {
  //           const columns = row.split(',');
  //           return {
  //             timestamp: new Date(columns[columns.length - 1]),
  //             reason: columns[columns.length - 2]
  //           };
  //         });

  //       // Merge metrics with reasons
  //       const enrichedData = parsedMetrics.map(metric => {
  //         const matchingReason = parsedReasons.find(reason => 
  //           reason.timestamp.getTime() === metric.timestamp.getTime()
  //         );
  //         return {
  //           ...metric,
  //           reason: matchingReason?.reason || ''
  //         };
  //       });

  //       setData(enrichedData);
  //     })
  //     .catch(error => console.error('Error loading data:', error));
  // }, []);

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

  // // Add these interfaces at the top of your file
  // interface RealTimeMetrics {
  //   instance: string;
  //   instanceId: string;
  //   currentValue: number;
  //   timestamp: string;
  //   lastUpdated: string;
  // }

  // // Add these states to your component
  // const [currentMetrics, setCurrentMetrics] = useState<RealTimeMetrics | null>(null);
  // const [metricsHistory, setMetricsHistory] = useState<{ time: Date; value: number }[]>([]);
  // const [metricsError, setMetricsError] = useState<string | null>(null);
  // //const plotRef = useRef<any>(null);

  // // Add this function to your component
  // const fetchRealTimeMetrics = async (instance: string) => {
  //   try {
  //     const response = await fetch(
  //       `https://u7i3wume3h.execute-api.us-east-1.amazonaws.com/default/InsightGuard-CloudWatch-RealTime?instance=${instance}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Accept': 'application/json',
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch metrics');
  //     }

  //     const data: RealTimeMetrics = await response.json();
  //     setCurrentMetrics(data);

  //     // Update history with new data point
  //     setMetricsHistory(prev => {
  //       const now = new Date();
  //       const newHistory = [...prev, { time: now, value: data.currentValue }];
  //       // Keep only last 2 minutes of data
  //       return newHistory.filter(point =>
  //         now.getTime() - point.time.getTime() <= 120000
  //       );
  //     });

  //     setMetricsError(null);
  //   } catch (err) {
  //     setMetricsError(err instanceof Error ? err.message : 'An error occurred');
  //   }
  // };

  // // Add this useEffect after your existing Select component
  // useEffect(() => {
  //   if (ec2Instance) {
  //     // Initial fetch
  //     fetchRealTimeMetrics(ec2Instance);

  //     // Set up 1-second interval
  //     const interval = setInterval(() => {
  //       fetchRealTimeMetrics(ec2Instance);
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  // }, [ec2Instance]);

  // Add this state near your other state declarations
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Update the ChatDrawer component
  const ChatDrawer = () => (
    <Drawer
      anchor="right"
      open={isChatOpen}
      onClose={() => setIsChatOpen(false)}
      variant="temporary"  // Changed from persistent to temporary
      PaperProps={{
        sx: {
          width: '30%',
          minWidth: '300px',
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
          zIndex: (theme) => theme.zIndex.drawer + 2
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{
          p: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="h6">Chat Assistant</Typography>
          <IconButton onClick={() => setIsChatOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Chatbot />
        </Box>
      </Box>
    </Drawer>
  );
  
  // Remove interface and add states directly to component
  /*
  const [currentMetrics, setCurrentMetrics] = useState(null);
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [metricsError, setMetricsError] = useState(null);
  */
/*
  // Convert fetch function to JavaScript
  const fetchRealTimeMetrics = async (instance) => {
    try {
      const response = await fetch(
        `https://u7i3wume3h.execute-api.us-east-1.amazonaws.com/default/InsightGuard-CloudWatch-RealTime?instance=${instance}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();
      //console.log('Fetched Data:', data);
      setCurrentMetrics(data);

      // Update history with new data point
      setMetricsHistory(prev => {
        const now = new Date();
        const newHistory = [...prev, { time: now, value: data.currentValue }];
        //console.log('New History:', newHistory); // Add this line
        // Keep only last 2 minutes of data
        const filteredHistory = newHistory.filter(point =>
          now.getTime() - point.time.getTime() <= 120000
        );
        //console.log('Filtered history:', filteredHistory); // Log the filtered history
        return filteredHistory;
      });

      setMetricsError(null);
    } catch (err) {
      setMetricsError(err?.message || 'An error occurred');
    }
  };

  // useEffect remains the same
  useEffect(() => {
    if (ec2Instance) {
      // Initial fetch
      fetchRealTimeMetrics(ec2Instance);

      // Set up 1-second interval
      const interval = setInterval(() => {
        fetchRealTimeMetrics(ec2Instance);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [ec2Instance]);
*/
/*
useEffect(() => {
  // Clear metrics history when the instance changes
  setMetricsHistory([]);
}, [ec2Instance]);

useEffect(() => {
  const worker = new Worker(new URL('./fetchMetricsWorker.js', import.meta.url));

  // Send the initial instance to the worker
  worker.postMessage({ instance: ec2Instance });

  worker.onmessage = (e) => {
    const { data, error } = e.data;
    if (error) {
      setMetricsError(error);
    } else {
      setCurrentMetrics(data);

      // Update history with new data point
      setMetricsHistory(prev => {
        const now = new Date();
        const newHistory = [...prev, { time: now, value: data.currentValue }];
        return newHistory.filter(point => now.getTime() - point.time.getTime() <= 120000);
      });
    }
  };

  return () => {
    worker.terminate();
  };
}, [ec2Instance]); // Re-run effect when ec2Instance 
*/
  return (

    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 0,              // Remove bottom margin
            minWidth: 'fit-content' // Prevent text wrapping
          }}
        >
          Metric Source:
        </Typography>
        <Select
          fullWidth
          value={ec2Instance}
          onChange={(e) => setEc2Instance(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="TSAS-StreamlitHost">TSAS-StreamlitHost</MenuItem>
          <MenuItem value="kidonteam5ec2">team5</MenuItem>
        </Select>
      </Box>



// ... in your component ...


      // ... in your component ...
      {/*
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{
          p: 2,
          bgcolor: '#000022',
          border: '1px solid #00ffff',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
          borderRadius: '8px',
          position: 'relative',
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#00ffff' }}>
            Real-time CPU Utilization
          </Typography>
          {metricsError && (
            <Typography
              color="error"
              sx={{
                color: '#ff0000',
                textShadow: '0 0 5px rgba(255, 0, 0, 0.5)',
                fontFamily: 'monospace'
              }}
            >
              Error loading metrics: {metricsError}
            </Typography>
          )}
          {currentMetrics && (
            <>
              <ReactSpeedometer
                maxValue={100}
                value={currentMetrics.currentValue}
                // Customizing needle
                needleColor="#00ffff"
                needleHeightRatio={0.7}
                needleTransition="easeElastic"
                needleTransitionDuration={1000}

                // Customizing segments
                segments={10}
                segmentColors={[
                  "#00ff00",  // green
                  "#40ff00",
                  "#80ff00",
                  "#bfff00",
                  "#ffff00",  // yellow
                  "#ffbf00",
                  "#ff8000",
                  "#ff4000",
                  "#ff0000",  // red
                  "#cc0000"
                ]}

                // Customizing text
                currentValueText="${value}% CPU"
                valueTextFontWeight="bold"
                valueTextFontSize="24px"
                textColor="#00ffff"

                // Customizing dimensions and padding
                height={200}
                fluidWidth={true}
                paddingHorizontal={20}
                paddingVertical={20}

                // Customizing ticks and labels
                customSegmentLabels={[
                  {
                    text: "Low",
                    position: "INSIDE",
                    color: "#00ff00",
                  },
                  {
                    text: "Medium",
                    position: "INSIDE",
                    color: "#ffff00",
                  },
                  {
                    text: "High",
                    position: "INSIDE",
                    color: "#ff0000",
                  },
                ]}
                ringWidth={30}
                labelFontSize="12px"
                valueFormat={false}
              />
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  color: '#00ffff',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  textShadow: '0 0 5px rgba(0, 255, 255, 0.5)',
                  mt: 1
                }}
              >
                Last updated: {new Date(currentMetrics.lastUpdated).toLocaleTimeString()}
              </Typography>
            </>
          )}
        </Paper>
      </Grid>


      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{
          p: 2,
          bgcolor: '#000022',
          border: '1px solid #00ffff',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
          borderRadius: '8px',
          position: 'relative',
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#00ffff' }}>
            Real-time CPU Utilization
          </Typography>
          {currentMetrics && (
            <>
              <ReactSpeedometer
                maxValue={100}
                value={currentMetrics.currentValue}
                needleColor="#00ffff"
                startColor="#00ff00"
                endColor="#ff0000"
                segments={20}
                needleTransitionDuration={1000}
                needleTransition="easeElastic"
                currentValueText="${value}% CPU"
                valueTextFontSize="24px"
                textColor="#00ffff"
                paddingHorizontal={20}
                paddingVertical={20}
                fluidWidth={true}
              />
            </>
          )}
        </Paper>
      </Grid>
*/}
<Typography>
  IFRAME
</Typography>
// Add the iframe here
<Box sx={{ mb: 2 }}>
  <iframe
    src="https://insightguard-realtime.dc9dyhi7rrbss.amplifyapp.com/"
    style={{ width: '100%', height: '500px', border: 'none' }}
    title="InsightGuard Real-time Metrics"
  ></iframe>
</Box>

   
<Grid container spacing={3} sx={{ mt: 0 }}>

{/* Real-time CPU Gauge */}
<Grid item xs={12} md={4}>
  <Grid container direction="column" spacing={1}>
    {/* Date Display */}
    <Grid item>
      <Typography variant="h6" sx={{ mb: 0 }}>
        CPU Utilisation:
        <Tooltip
          title={
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Metric Description</Typography>
              <Typography variant="body2">The percentage of physical CPU time that Amazon EC2 uses to run the EC2 instance, which includes time spent to run both the user code and the Amazon EC2 code.</Typography>
            </div>
          }
          placement="right"
        >
          <IconButton sx={{ color: '#4a4a4a', ml: 1 }}> {/* Dark gray color */}
            <InfoIcon sx={{ fontSize: 'medium' }} />
          </IconButton>
        </Tooltip>
      </Typography>
    </Grid>
    {/*
    <Grid item sx={{ mb: 2 }}>
      <Paper elevation={2} sx={{ p: 2, bgcolor: '#ffffff' }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
          Real-time CPU Utilisation

        </Typography>
        {metricsError && (
          <Typography color="error">
            Error loading metrics: {metricsError}
          </Typography>
        )}
        {currentMetrics && (
          <>
            <GaugeChart
              id="cpu-gauge"
              nrOfLevels={30}
              colors={["#FFC371", "#FF5F6D"]}
              arcWidth={0.3}
              percent={currentMetrics.currentValue / 100}
              textColor="#000000"
              formatTextValue={(value) => `${(value)}`}
              animate={false}
            />
            <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', display: 'block', textAlign: 'left' }}>
              Last updated:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', display: 'block', textAlign: 'center' }}>
              Time: {new Date(currentMetrics.lastUpdated).toLocaleTimeString()}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', display: 'block', textAlign: 'center' }}>
              Date: {currentDate}
            </Typography>
          </>
        )}
      </Paper>
    </Grid>
    */}
  </Grid>
</Grid>
{/* Real-time Chart */}
      {/*
<Grid item xs={12} md={8}>
  <Paper elevation={2} sx={{ p: 2, bgcolor: '#ffffff' }}>
    <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
      CPU Utilization History (Last 2 minutes)
    </Typography>
    {metricsHistory.length > 0 && (
      <Plot
        data={[
          {

            x: metricsHistory.map(m => m.time),
            y: metricsHistory.map(m => m.value),
            type: 'scatter',
            mode: 'lines',
            name: 'CPU Utilization',
            line: { color: '#8884d8', width: 2 }
          }
        ]}
        layout={{
          autosize: true,
          height: 280,
          margin: { l: 50, r: 30, t: 20, b: 50 },
          xaxis: {
            title: 'Time',
            tickangle: -45,
            range: [
              new Date(Date.now() - 120000), // 2 minutes ago
              new Date() // now
            ],
            type: 'date'
          },
          yaxis: {
            title: 'CPU Utilization (%)',
            range: [0, 100]
          }
        }}
        config={{
          responsive: true,
          displayModeBar: false
        }}
        style={{ width: '100%' }}
      />
    )}
  </Paper>
</Grid>
        */}
</Grid>


      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Paper
          onClick={handleToggle}
          sx={{
            cursor: 'pointer',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            height: '40px', // Set a fixed height
            mr: -1, // Overlap the toggle buttons
            borderRadius: '4px 0 0 4px', // Rounded left corners
            position: 'relative',
            zIndex: 1,
            backgroundColor: '#ffffff',
            '&:after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              right: -10, // Adjust to create the angled edge
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '20px 0 20px 10px', // Triangle dimensions
              borderColor: 'transparent transparent transparent #ffffff', // Triangle color
            },
          }}
        >
          Models
        </Paper>
        {showToggleButtons && (
          <ToggleButtonGroup
            value={ec2Models}
            onChange={(e, newModels) => setEc2Models(newModels)}
            sx={{ ml: 0.5, height: '40px' }} // Match the height of the "Models" button
          >
            <ToggleButton value="LSTM" sx={{ height: '40px', pl: 3 }}>  LSTM</ToggleButton>
            <ToggleButton value="ARIMA" sx={{ height: '40px' }}>ARIMA</ToggleButton>
            <ToggleButton value="Other" sx={{ height: '40px' }}>Other</ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      // ... existing code ...
      <ToggleButtonGroup
        value={ec2Models}
        onChange={(e, newModels) => setEc2Models(newModels)}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="LSTM">LSTM</ToggleButton>
        <ToggleButton value="ARIMA">ARIMA</ToggleButton>
        <ToggleButton value="Other">Other</ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="h6" gutterBottom>Source Details:</Typography>
      <Grid container spacing={3} sx={{ mb: 8, mx: 0, width: '100%' }}>
        {/* Instance Details Column */}
        <Grid item xs={12} md={4} sx={{ pl: { xs: 0, md: 2 } }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              bgcolor: '#f5f5f5',
              '&:hover': { boxShadow: 3 }
            }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#2196f3' }}>
              Instance Details
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Instance Type"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 't3.2xlarge' : 't2.xlarge'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Instance ID"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 'i-0001324e481555bb7' : 'i-08a4986ef5bc41d72'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="vCPUs"
                  secondary="8"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Virtualization Type"
                  secondary="hvm"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Network Details Column */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              bgcolor: '#f5f5f5',
              '&:hover': { boxShadow: 3 }
            }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#2196f3' }}>
              Network Details
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Region"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 'us-east-1' : 'ap-south-1'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="VPC"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 'vpc-0a8f8b2c7d9e6f4a1' : 'vpc-1234567890abcdef0'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Subnet"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 'subnet-0123456789abcdef0' : 'subnet-abcdef0123456789'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Security Group"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 'sg-0123456789abcdef0' : 'sg-abcdef0123456789'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Other Details Column */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              bgcolor: '#f5f5f5',
              '&:hover': { boxShadow: 3 }
            }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#2196f3' }}>
              Other Details
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="AMI ID"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 'ami-0123456789abcdef0' : 'ami-abcdef0123456789'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Launch Time"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? '2023-12-01' : '2023-11-15'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Tags"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 'TSAT' : 'Team5'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Status"
                  secondary="Running"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>


      {ec2Instance === 'TSAS-StreamlitHost' && ec2Models.includes('LSTM') && (
        <Grid item xs={12}>
          <Typography variant="subtitle1">LSTM Forecasting - Nov-21 - Dec-07 </Typography>
          <Paper elevation={2} sx={{ p: 1, bgcolor: '#ffffff' }}>
            {/* <Typography variant="subtitle1">CPU Utilization</Typography> */}
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
                    'Predicted: %{y:.2f}%<br>' +
                    'Time: %{x}<extra></extra>'
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
        </Grid>
      )}


      {/* Original Code */}
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
      {/* Floating chat button */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1200
        }}
        onClick={() => setIsChatOpen(true)}
      >
        <ChatIcon />
      </Fab>

      {/* Chat Drawer */}
      <ChatDrawer />
    </Box>

  )
}


