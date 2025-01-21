import { Box, Paper, Tooltip, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import LatencyStats from '../Statistics_Component/latency_stats';
export default function AnomalyDetectionIsolationForest() {
  const [anomalytimelineData, anomalysetTimelineData] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch('/src/assets/Network_Graphs/API_Gateway_Graphs/Anomaly_Detection_Isolation_Forest.csv')
      .then((response) => response.text())
      .then((csvData) => {
        console.log(csvData);
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
  return (
    <>
      <Grid item xs={12} gutterBottom>
        <Box sx={{ mb: 4 }}>
          <Tooltip
            title={
              <Box>
                <Typography variant="body2">Model: Isolation Forest</Typography>
                <Typography variant="body2">Date Range: Jan-01 - Jan-07</Typography>
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
              - T5 Anomaly Detection
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
        </Box>
      </Grid>
      <LatencyStats stats={stats} />
    </>
  );
}