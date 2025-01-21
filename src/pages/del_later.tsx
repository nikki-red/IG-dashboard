<!DOCTYPE html>
<html>
<head>
    <title>CloudWatch Metrics Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div style="width: 800px; margin: 0 auto;">
        <canvas id="metricsChart"></canvas>
    </div>

    <script>
        const API_ENDPOINT = 'YOUR_API_GATEWAY_URL';
        let chart;

        async function fetchMetrics() {
            try {
                const response = await fetch(`${API_ENDPOINT}?metricName=CPUUtilization&namespace=AWS/EC2&dimensionName=InstanceId&dimensionValue=YOUR_INSTANCE_ID`);
                const data = await response.json();
                
                updateChart(data);
            } catch (error) {
                console.error('Error fetching metrics:', error);
            }
        }

        function updateChart(data) {
            const ctx = document.getElementById('metricsChart').getContext('2d');
            
            if (chart) {
                chart.destroy();
            }

            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.timestamps.map(ts => new Date(ts).toLocaleTimeString()),
                    datasets: [{
                        label: data.metric,
                        data: data.values,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Fetch metrics every 60 seconds
        fetchMetrics();
        setInterval(fetchMetrics, 60000);
    </script>
</body>
</html>

return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      

      {/* Main Content with Side Navigation */}
        {/* Side Navigation */}
        <Box sx={{ width: '200px', borderRight: 1, borderColor: 'divider' }}>
          <List>
            <ListItem 
              button 
              selected={activeMetric === 'infrastructure'}
              onClick={() => setActiveMetric('infrastructure')}
            >
              <ListItemText primary="Infrastructure Metrics" />
            </ListItem>
            <ListItem 
              button 
              selected={activeMetric === 'network'}
              onClick={() => setActiveMetric('network')}
            >
              <ListItemText primary="Network Metrics" />
            </ListItem>
          </List>
        </Box>

        {/* Metrics Display Area */}
        <Box sx={{ flexGrow: 1, p: 2 }}>
          {activeMetric === 'infrastructure' ? (
            // Infrastructure Metrics
            <Paper sx={{ p: 2, height: '100%', overflow: 'auto', bgcolor: '#f5f9ff' }}>
              <Typography variant="h6">Infrastructure Metrics</Typography>
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
                  {/* <Paper elevation={2} sx={{ p: 1, bgcolor: '#f7fff5' }}> */}
                    <Typography variant="subtitle1">CPU Utilization</Typography>
                    <Grid container spacing={2}>
                      
                    {ec2Instance === 'TSAS-StreamlitHost' && ec2Models.includes( 'LSTM' ) && (
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
                    {ec2Instance === 'TSAS-StreamlitHost' && ec2Models.includes( 'LSTM' ) && (
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

                            {/* QuickSight ARIMA Forecast */}
                          {ec2Instance === 'TSAS-StreamlitHost' && ec2Models.includes( 'ARIMA' ) && (
                            <Grid item xs={6}>
                              <Typography variant="subtitle1">QuickSight ARIMA Forecasting - Dec-01 - Dec-07</Typography>
                              <Paper elevation={2} sx={{ p: 1, bgcolor: '#ffffff' }}>
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
                            </Grid>
                          )}

                            {/* QuickSight ARIMA Validation */}
                          {ec2Instance === 'TSAS-StreamlitHost' && ec2Models.includes( 'ARIMA' ) && (
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
                                      ) * 1.1] // Add 10% padding to the top
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
                      <Grid item xs={12}>
                      {/* EC2 Insights Section */}
                        {/* <Paper sx={{ p: 2, mt: 1, bgcolor: '#f7fff5' }}> */}
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
                        {/* </Paper> */}
                        </Grid>
                      
                    </Grid>
                  
                </Grid>
  
              </Grid>
            </Paper>
          ) : (
            // Network Metrics
            <Grid container spacing={2} direction="column">
              {/* API Gateway Metrics */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, height: 'calc(100% - 800px)', overflow: 'auto', display: 'flex', flexDirection: 'column', bgcolor: '#f7fff5' }}>
                  <Typography variant="h6">API Gateway Metrics</Typography>
                  <Select
                    fullWidth
                    value={apiType}
                    onChange={(e) => setApiType(e.target.value)}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="team5-credit-API">team5-credit-API-synthetic</MenuItem>
                  </Select>

                  <ToggleButtonGroup
                    value={apiModels}
                    onChange={(e, newModels) => setApiModels(newModels)}
                    sx={{ mb: 5 }}
                  >
                    {/* <ToggleButton value="LSTM">LSTM</ToggleButton> */}
                    <ToggleButton value="Prophet">Prophet-Forecast</ToggleButton>
                    <ToggleButton value="ARIMA">QuickSight-ARIMA-Forecast</ToggleButton>
                    <ToggleButton value="Claude">Claude-Forecast</ToggleButton>
                    <ToggleButton value="Anomaly">QuickSight Anomaly Detection</ToggleButton>
                    <ToggleButton value="Other">Other</ToggleButton>
                    {/* <ToggleButton value="Prophet">Custom-Isolation Forest-Anomaly</ToggleButton> */}
                    {/* <ToggleButton value="ARIMA">ARIMA</ToggleButton> */}
                    {/* <ToggleButton value="QuickSight">QuickSight-Anomaly</ToggleButton> */}
                  </ToggleButtonGroup>
                 
                  { apiModels.includes( 'Prophet' ) && (
                    <Grid item xs={12}>
                    <Typography variant="subtitle1">Latency</Typography>
                    <Typography variant="subtitle1">Prophet Forecasting - Jan-07 - 24-hour - Actual vs Predicted</Typography>
                    <Paper elevation={2} sx={{ p: 1, bgcolor: '#ffffff' }}>
                      <Plot
                        data={[
                          // Actual Values
                          {
                            x: latencyProphetData.map(d => d.timestamp),
                            y: latencyProphetData.map(d => d.actual),
                            type: 'scatter',
                            mode: 'lines',
                            name: 'Actual Latency',
                            line: { color: '#2c3e50', width: 1 }
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
                  </Grid>
                  )}
                  { apiModels.includes( 'ARIMA' ) && (
                    <Grid item xs={12}>
                    <Typography variant="subtitle1">QuickSight-ARIMA Forecasting - Jan-07 - 24-hour</Typography>
                    <Paper elevation={2} sx={{ p: 2, bgcolor: '#ffffff' }}>
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
                  </Grid>
                  )}
                  { apiModels.includes( 'Claude' ) && (
                  <Grid spacing={2}>
                  <Grid item xs={12}>
                  <Typography variant="subtitle1">Claude Forecasting - Jan-07 - 24-hour</Typography>
                  <Paper elevation={2} sx={{ p: 2, bgcolor: '#ffffff' }}>
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

                  {/* Add statistics panel */}
                  <Paper elevation={2} sx={{ p: 2, mt: 2, bgcolor: '#ffffff' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Forecast Statistics
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">
                          Prediction Period: 24 hours (Jan 7th 00:00 - Jan 7th 23:00)
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">
                          Prediction Interval: Hourly
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">
                          Forecast Range: 45ms - 180ms
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                </Grid>
              )}
                  { apiModels.includes( 'Anomaly' ) && (
                        <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                        QuickSight-Anomaly Detection - Jan-01 - Jan-07 
                        </Typography>
                        <Paper elevation={2} sx={{ p: 2, bgcolor: '#ffffff' }}>

                        <Plot
                          data={[
                            // Normal Points
                            {
                              // x: anomalytimelineData
                              //   .filter(d => d.isAnomaly === 0)
                              //   .map(d => d.timestamp),
                              // y: anomalytimelineData
                              //   .filter(d => d.isAnomaly === 0)
                              //   .map(d => d.latency),
                              x: anomalytimelineData.map(d => d.timestamp),
                              y: anomalytimelineData.map(d => d.latency),
                              type: 'scatter',
                              mode: 'lines',
                              name: 'Normal Latency',
                              line: { color: '#1f77b4', width: 1 }
                            },
                            // Anomaly Points
                            {
                              x: anomalytimelineData
                                .filter(d => d.isAnomaly === 1)
                                .map(d => d.timestamp),
                              y: anomalytimelineData
                                .filter(d => d.isAnomaly === 1)
                                .map(d => d.latency),
                              type: 'scatter',
                              mode: 'markers',
                              name: 'Anomaly',
                              marker: { 
                                color: '#e74c3c',
                                size: 12,
                                symbol: 'star',
                                line: {
                                  color: '#c0392b',
                                  width: 2
                                }
                              }
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
                              dtick: 3600000 * 6  // 6-hour intervals
                            },
                            yaxis: {
                              title: 'Latency (ms)',
                              gridcolor: '#e5e5e5',
                              zeroline: false,
                              
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
                    </Grid>

                    {/* Statistics Panel */}
                    <Grid item xs={12}>
                      <Paper elevation={2} sx={{ p: 2, bgcolor: '#ffffff' }}>
                        <Typography variant="subtitle1" gutterBottom>
                          System Analysis
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">Total Data Points</Typography>
                            <Typography variant="body1">{stats.total}</Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">Anomalies Detected</Typography>
                            <Typography variant="body1">{stats.anomalies} ({stats.anomalyRate}%)</Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">Average Latency</Typography>
                            <Typography variant="body1">{stats.avgLatency} ms</Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">Average Requests/5min</Typography>
                            <Typography variant="body1">{stats.avgRequests}</Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    </Grid>
                  )}
                  
                </Paper>
                                
                {/* // Add this inside your API Gateway section, after the QuickSight iframes */}
                <Typography variant="h6" sx={{ mb: 1 }}>API Gateway Insights</Typography>
                <Paper sx={{ p: 2, mt: 1, bgcolor: '#f7fff5' }}>
                  
                  {apiGatewayInsights ? (
                    <Typography 
                    component="pre"
                    sx={{ 
                      whiteSpace: 'pre-line',
                      // fontFamily: 'inherit',
                      p: 2 
                    }}
                  >
                    {`Key Statistics:
                    • Min Latency: ${apiGatewayInsights.key_statistics.min} ms
                    • Max Latency: ${apiGatewayInsights.key_statistics.max} ms
                    • Mean Latency: ${apiGatewayInsights.key_statistics.mean.toFixed(2)} ms
                    • Median Latency: ${apiGatewayInsights.key_statistics.median.toFixed(2)} ms

                    Percentiles:
                    • 25th: ${apiGatewayInsights.key_statistics.percentiles['25th'].toFixed(2)} ms
                    • 50th: ${apiGatewayInsights.key_statistics.percentiles['50th'].toFixed(2)} ms
                    • 75th: ${apiGatewayInsights.key_statistics.percentiles['75th'].toFixed(2)} ms
                    • 90th: ${apiGatewayInsights.key_statistics.percentiles['90th'].toFixed(2)} ms
                    • 95th: ${apiGatewayInsights.key_statistics.percentiles['95th'].toFixed(2)} ms

                    Standard Deviation: ${apiGatewayInsights.key_statistics.std_dev.toFixed(2)} ms

                    Temporal Patterns:
                    Hourly Patterns:${apiGatewayInsights.temporal_patterns.hourly_patterns.map(pattern => 
                      `\n  • Hour ${pattern.hour}: ${pattern.pattern}`
                    ).join('')}

                    Daily Patterns:${apiGatewayInsights.temporal_patterns.daily_patterns.map(pattern => 
                      `\n  • ${pattern.day}: ${pattern.pattern}`
                    ).join('')}

                    Recurring Spikes: ${apiGatewayInsights.temporal_patterns.recurring_spikes}

                    Stability: ${apiGatewayInsights.temporal_patterns.stability}

                    Performance Analysis:
                    Overall Performance: ${apiGatewayInsights.performance_analysis.overall_performance}

                    Potential Issues:${apiGatewayInsights.performance_analysis.potential_issues.map(issue => 
                      `\n  • ${issue}`
                    ).join('')}

                    Optimization Areas:${apiGatewayInsights.performance_analysis.optimization_areas.map(area => 
                      `\n  • ${area}`
                    ).join('')}

                    Anomaly Detection:
                    Unusual Patterns:${apiGatewayInsights.anomaly_detection.unusual_patterns.map(pattern => 
                      `\n  • ${pattern}`
                    ).join('')}

                    Potential Causes:${apiGatewayInsights.anomaly_detection.potential_causes.map(cause => 
                      `\n  • ${cause}`
                    ).join('')}`}
                  </Typography>
                  ) : (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Loading insights...
                    </Typography>
                  )}
                </Paper>
              </Grid>

              {/* Lambda Metrics */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, height: 'calc(100% - 1200px)', overflow: 'auto', display: 'flex', flexDirection: 'column', bgcolor: '#f7fff5' }}>
                  <Typography variant="h6">Lambda Metrics</Typography>
                  <Select
                    fullWidth
                    value={lambdaFunction}
                    onChange={(e) => setLambdaFunction(e.target.value)}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="team5-credit">team5-credit</MenuItem>
                  </Select>

                  <ToggleButtonGroup
                    value={lambdaModels}
                    onChange={(e, newModels) => setLambdaModels(newModels)}
                    sx={{ mb: 2 }}
                  >
                    <ToggleButton value="KMeansIsolation Forest">Isolation Forest</ToggleButton>
                    <ToggleButton value="KMeansIsolation Forest">Moving Average-Z Score</ToggleButton>
                    <ToggleButton value="Other">Other</ToggleButton>
                  </ToggleButtonGroup>
                  </Paper>
                
                <Grid container spacing={3}>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Lambda Invocations & Anomaly Detection - Oct-12 - Nov-29
                  </Typography>
                <Paper elevation={2} sx={{ p: 2, bgcolor: '#f7fff5' }}>

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
                      height: 400,
                      margin: { l: 60, r: 30, t: 30, b: 50 },
                      showlegend: true,
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
              </Grid>

              {/* Hourly Distribution Graph */}
              <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Hourly Invocation Distribution - Oct-12 - Nov-29
                  </Typography>
                <Paper elevation={2} sx={{ p: 2, bgcolor: '#f7fff5' }}>

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
                      height: 400,
                      margin: { l: 60, r: 30, t: 30, b: 50 },
                      showlegend: true,
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
              </Grid>

              {/* Data Table */}
              <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Detailed Peak Traffic Metrics - Oct-12 - Nov-29
                  </Typography>
                <Paper elevation={2} sx={{ p: 2, bgcolor: '#f7fff5' }}>

                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Time</TableCell>
                          <TableCell>Hour</TableCell>
                          <TableCell align="right">Invocations</TableCell>
                          <TableCell>Anomaly</TableCell>
                          <TableCell>Peak Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {classifiedData.map((row, index) => (
                          <TableRow key={index} sx={{ 
                            bgcolor: row.anomaly === -1 ? '#fff3cd' : 'inherit'
                          }}>
                            <TableCell>{row.startTime.toLocaleString()}</TableCell>
                            <TableCell>{row.hour}</TableCell>
                            <TableCell align="right">{row.invocations}</TableCell>
                            <TableCell>{row.anomaly === -1 ? 'Yes' : 'No'}</TableCell>
                            <TableCell>{row.peakHourStatus}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
               
              </Grid>
    

                    {/* Statistics Panel */}
                    <Grid item xs={12}>
                      <Paper elevation={2} sx={{ p: 2, bgcolor: '#ffffff' }}>
                        <Typography variant="subtitle1" gutterBottom>
                          System Analysis
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">Peak Hours Invocations</Typography>
                            <Typography variant="body1">
                              {classifiedData
                                .filter(d => d.peakHourStatus === 'Peak Hours')
                                .reduce((sum, d) => sum + d.invocations, 0)
                                .toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">Non-Peak Hours Invocations</Typography>
                            <Typography variant="body1">
                              {classifiedData
                                .filter(d => d.peakHourStatus === 'Non-Peak Hours')
                                .reduce((sum, d) => sum + d.invocations, 0)
                                .toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">Anomalies Detected</Typography>
                            <Typography variant="body1">
                              {classifiedData.filter(d => d.anomaly === -1).length}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="textSecondary">Error Events</Typography>
                            <Typography variant="body1">
                              {classifiedData.filter(d => d.errors > 0).length}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                  {/* Lambda Insights Section */}
                <Paper sx={{ p: 2, mt: 1, bgcolor: '#f7fff5' }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>Lambda Insights</Typography>
                  {insights ? (
                    <Typography variant="body1" 
                    sx={{ 
                      whiteSpace: 'pre-line',
                      p: 1,
                      bgcolor: 'white',
                      borderRadius: '4px'
                    }}>
                      {insights}
                    </Typography>
                  ) : (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Loading insights...
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Main Content with Side Navigation */}
        

        {/* Metrics Display Area */}
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Paper sx={{ p: 2, height: '100%', overflow: 'auto', bgcolor: '#f5f9ff' }}>
            <Typography variant="h6">Infrastructure Metrics</Typography>
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
);
























// Add these interfaces at the top of your file
interface RealTimeMetrics {
  instance: string;
  instanceId: string;
  currentValue: number;
  timestamp: string;
  lastUpdated: string;
}

// Add these states to your component
const [currentMetrics, setCurrentMetrics] = useState<RealTimeMetrics | null>(null);
const [metricsHistory, setMetricsHistory] = useState<{ time: Date; value: number }[]>([]);
const [metricsError, setMetricsError] = useState<string | null>(null);
//const plotRef = useRef<any>(null);

// Add this function to your component
const fetchRealTimeMetrics = async (instance: string) => {
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

    const data: RealTimeMetrics = await response.json();
    setCurrentMetrics(data);

    // Update history with new data point
    setMetricsHistory(prev => {
      const now = new Date();
      const newHistory = [...prev, { time: now, value: data.currentValue }];
      // Keep only last 2 minutes of data
      return newHistory.filter(point =>
        now.getTime() - point.time.getTime() <= 120000
      );
    });

    setMetricsError(null);
  } catch (err) {
    setMetricsError(err instanceof Error ? err.message : 'An error occurred');
  }
};

// Add this useEffect after your existing Select component
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



{/* Real-time CPU Gauge */}
<Grid item xs={12} md={6}>
<Paper elevation={2} sx={{ p: 2, bgcolor: '#ffffff' }}>
  <Typography variant="h6" gutterBottom>
    Real-time CPU Utilization
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
        nrOfLevels={3}
        colors={['#5BE12C', '#F5CD19', '#EA4228']}
        percent={currentMetrics.currentValue / 100}
        textColor="#000000"
        formatTextValue={(value) => `${(value)}`}
        animate={false}
      />
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
        Last updated: {new Date(currentMetrics.lastUpdated).toLocaleTimeString()}
      </Typography>
    </>
  )}
</Paper>
</Grid>