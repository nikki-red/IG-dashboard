import { Box, IconButton, Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import { Fade, Grow } from '@mui/material';
import MetricsSource from '../API Gateway/metrics_source'
import React, { useState } from 'react';
import ModelButtonForecast from '../model_button_forecast';
import ModelButtonAnomalyDetection from '../model_button_anomaly_detection';
import AnomalyDetectionIsolationForest from './Graphs_Component/anomaly_detection_isolation_forest';
import LatencyProphet from './Graphs_Component/latency_prophet';
import LatencyArima from './Graphs_Component/latency_arima';
import LatencyClaude from './Graphs_Component/latency_claude';
import LatencyInsightsComponent from './Insights_Component/latency_insights';
import InfoIcon from '@mui/icons-material/Info';
import LatencyTitle from './latency_title';

export default function API_Gateway_Page() {
    const [apiType, setApiType] = useState('');
    const [apiModels, setApiModels] = useState('Prophet');
    const [apiModelsAnomaly, setApiModelsAnomaly] = useState('Isolation Forest');

    const renderGraphsForecast = () => {
        if (apiType === 'team5-credit-API') {
          return (
            <Grow in={true} timeout={400}>
              <Box>
                {apiModels.includes('Prophet') && <LatencyProphet />}
                {apiModels.includes('ARIMA') && <LatencyArima />}  
                {apiModels.includes('Claude') && <LatencyClaude />}
              </Box>
            </Grow>
          );
        }
    };

    const renderGraphsAnomalyDetection = () => {
        if (apiType === 'team5-credit-API') {
          return (
            <Grow in={true} timeout={400}>
              <Box>
                {apiModelsAnomaly.includes('Isolation Forest') && <AnomalyDetectionIsolationForest />}
              </Box>
            </Grow>
          );
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Metric Source */}
            <MetricsSource apiType={apiType} setApiType={setApiType} />
            
            <Fade in={Boolean(apiType)} timeout={200}>
                <Box sx={{ display: apiType ? 'block' : 'none' }}>
                  <LatencyTitle />
                </Box>
            </Fade>

            {/* Model Button with Fade animation */}
            <Fade in={Boolean(apiType)} timeout={200}>
                <Box sx={{ display: apiType ? 'block' : 'none' }}>
                    <ModelButtonForecast apiType={apiType} apiModels={apiModels} setApiModels={setApiModels} />
                </Box>
            </Fade>

            {/* Forecast Graphs */}
            {apiType && renderGraphsForecast()}

            {/* Anomaly Detection Button with Fade animation */}
            <Fade in={Boolean(apiType)} timeout={300}>
                <Box sx={{ display: apiType ? 'block' : 'none' }}>
                    <ModelButtonAnomalyDetection apiType={apiType} apiModelsAnomaly={apiModelsAnomaly} setApiModelsAnomaly={setApiModelsAnomaly} />
                </Box>
            </Fade>

            {/* Anomaly Detection Graphs */}
            {apiType && renderGraphsAnomalyDetection()}

            {/* Insights with Grow animation */}
            <Grow in={Boolean(apiType)} timeout={500}>
                <Box sx={{ display: apiType ? 'block' : 'none' }}>
                    <LatencyInsightsComponent apiGateway={apiType} />
                </Box>
            </Grow>
        </Box>  
    );
}