import { Typography, MenuItem, Box, Select } from '@mui/material';
import React from 'react';
import SourceDetails from './source_details'

export default function MetricsSource({ec2Instance, setEc2Instance}) {
  return (
    <>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
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
          value={ec2Instance || ""}
          onChange={(e) => setEc2Instance(e.target.value)}
          sx={{ mb: 0 }}
          displayEmpty
        >
          <MenuItem value="" disabled>Select EC2 Instance</MenuItem>
          <MenuItem value="kidonteam5ec2">team5</MenuItem>
          <MenuItem value="TSAS-StreamlitHost">TSAS-StreamlitHost</MenuItem>
        </Select>
      </Box>

      </>
  );
}

