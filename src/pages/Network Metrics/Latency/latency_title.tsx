import React from 'react';
import { Typography, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const LatencyTitle = () => {
  return (
    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mr: 0 }}>
      Latency
      <Tooltip
        title={
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Metric Description:</Typography>
            <Typography variant="body2">The time between when API Gateway receives a request from a client and when it returns a response to the client.</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Unit info:</Typography>
            <Typography variant="body2">Millisecond</Typography>
          </div>
        }
        placement="right"
      >
        <IconButton sx={{ color: '#4a4a4a', ml: 0 }}> {/* Dark gray color */}
          <InfoIcon sx={{ fontSize: 'medium' }} />
        </IconButton>
      </Tooltip>
    </Typography>
  );
};

export default LatencyTitle;