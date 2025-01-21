import * as React from 'react';
import { useState } from 'react';
import { Box, Divider, Fade, Grow } from '@mui/material';
import MetricsSource from './Infrastructure Metrics/metrics_source';
import SourceDetails from './Infrastructure Metrics/source_details';
import ModelButton from './Infrastructure Metrics/model_button.tsx';
import TSAS_LSTMForecast from './Infrastructure Metrics/Graphs_Components/TSAS/TSAS_lstm_forecast.tsx';
import TSAS_EC2InsightsComponent from './Infrastructure Metrics/Insights_Components/TSAS_ec2_insights.tsx';
import Team5_EC2InsightsComponent from './Infrastructure Metrics/Insights_Components/team5_ec2_insights.tsx';
import EC2InsightsComponent from './Infrastructure Metrics/Insights_Components/ec2_insights.tsx';
import TSAS_ARIMAForecast from './Infrastructure Metrics/Graphs_Components/TSAS/TSAS_arima_forecast.tsx';
import Team5_LSTMForecast from './Infrastructure Metrics/Graphs_Components/team5/team5_lstm_forecast.tsx';

export default function Index() {
  const [ec2Instance, setEc2Instance] = useState('');
  const [ec2Models, setEc2Models] = useState('LSTM');
  const renderGraphs = () => {
    if (ec2Instance === 'TSAS-StreamlitHost') {
      return (
        <Grow in={true} timeout={400}>
          <Box>
            {ec2Models.includes('LSTM') && <TSAS_LSTMForecast />}
            {ec2Models.includes('ARIMA') && <TSAS_ARIMAForecast />}
          </Box>
        </Grow>
      );
    }
    if (ec2Instance === 'kidonteam5ec2') {
      return (
        <Grow in={true} timeout={400}>
          <Box>
            {ec2Models.includes('LSTM') && <Team5_LSTMForecast />}
          </Box>
        </Grow>
      );
    }
  };
  const renderEC2Insights = () => {
    if (ec2Instance === 'TSAS-StreamlitHost') {
      return <TSAS_EC2InsightsComponent />;
    }
    if (ec2Instance === 'kidonteam5ec2') {
      return <Team5_EC2InsightsComponent />;
    }
  };
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', flex: 1, border: 0 }} allowFullScreen>
      {/* Metric Source */}
      <MetricsSource ec2Instance={ec2Instance} setEc2Instance={setEc2Instance} />
      {/* Source Details with Fade animation */}
      <Fade in={Boolean(ec2Instance)} timeout={200}>
        <Box sx={{ display: ec2Instance ? 'block' : 'none' }}>
          <SourceDetails ec2Instance={ec2Instance} />
        </Box>
      </Fade>

      {ec2Instance && <Divider sx={{ my: 2, borderColor: 'gray', borderBottomWidth: 2 }} />}
      <Fade in={Boolean(ec2Instance)} timeout={300}>
        <Box sx={{ display: ec2Instance ? 'block' : 'none' }}>
          {ec2Instance === 'kidonteam5ec2' && (
            <Box sx={{ mb: 2 }}>

              <iframe
                src="https://build-ig-team5-realtime-1.dc9dyhi7rrbss.amplifyapp.com"
                style={{ width: '100%', height: '470px', border: 'none' }}
                title="InsightGuard Real-time Metrics"
              ></iframe>

            </Box>
          )}
          {ec2Instance === 'TSAS-StreamlitHost' && (
            <Box sx={{ mb: 2 }}>

              <iframe
                src="https://build-ig-tsas-realtime.dc9dyhi7rrbss.amplifyapp.com"
                style={{ width: '100%', height: '470px', border: 'none' }}
                title="InsightGuard Real-time Metrics"
              ></iframe>

            </Box>
          )}
        </Box>
      </Fade>
      {ec2Instance && <Divider sx={{ my: 2, borderColor: 'gray', borderBottomWidth: 2 }} />}

      {/* Model Button with Fade animation */}
      <Fade in={Boolean(ec2Instance)} timeout={300}>
        <Box sx={{ display: ec2Instance ? 'block' : 'none' }}>
          <ModelButton ec2instance={ec2Instance} ec2Models={ec2Models} setEc2Models={setEc2Models} />
        </Box>
      </Fade>
      {/* Graphs with animation handled in renderGraphs */}
      {ec2Instance && renderGraphs()}

      {ec2Instance && <Divider sx={{ my: 2, borderColor: 'gray', borderBottomWidth: 2 }} />}

      {/* EC2 Insights with Grow animation */}
      <Grow in={Boolean(ec2Instance)} timeout={500}>
        <Box sx={{ display: ec2Instance ? 'block' : 'none' }}>
          <EC2InsightsComponent ec2Instance={ec2Instance} />
        </Box>
      </Grow>
    </Box>
  );
}
