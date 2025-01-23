import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { Fade, Grow } from '@mui/material';
import MetricsSource from './metrics_source';
import React, { useState } from 'react';
import ModelButtonLambda from '../model_button_lambda';
//import LatencyArima from '../API Gateway/Graphs_Component/latency_arima';
//import LatencyProphet from '../API Gateway/Graphs_Component/latency_prophet';
import AnomalyDetectionIsolationForest from './Graphs_Component/lambda_anomaly_detection_isolation_forest';
import LambdaInsights from './Insights_Component/lambda_insights';

export default function Traffic_Lambda_Page() {
  const [lambdaFunction, setLambdaFunction] = useState('');
  const [lambdaModels, setLambdaModels] = useState('Isolation Forest');
  const renderGraphs = () => {
    if (lambdaFunction === 'team5-credit') {
      return (
        <Grow in={true} timeout={400}>
          <Box>
            {lambdaModels.includes('Isolation Forest') && <AnomalyDetectionIsolationForest />}  
            {/*lambdaModels.includes('Moving Average-Z Score') && <AnomalyDetectionMovingAverageZScore />*/}  
          </Box>
        </Grow>
      );
    }
  };  
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/*Metric Source*/}
      <MetricsSource lambdaFunction={lambdaFunction} setLambdaFunction={setLambdaFunction} /> 
      {/* Model Button with Fade animation */}
      <Fade in={Boolean(lambdaFunction)} timeout={200}>
        <Box sx={{ display: lambdaFunction ? 'block' : 'none' }}>
          <ModelButtonLambda lambdaFunction={lambdaFunction} lambdaModels={lambdaModels} setLambdaModels={setLambdaModels} />
        </Box>
      </Fade>
      {/* Graphs with animation handled in renderGraphs */}
      {lambdaFunction && renderGraphs()}
      {/* Insights with Grow animation */}
      <Grow in={Boolean(lambdaFunction)} timeout={500}>
        <Box sx={{ display: lambdaFunction ? 'block' : 'none' }}>
          <LambdaInsights />
        </Box>
      </Grow>
    </Box>  
  );
}