import { Typography, MenuItem, Box, Select } from '@mui/material';
import React from 'react';

export default function MetricsSource({lambdaFunction, setLambdaFunction}) {
  return (
    <>
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
          value={lambdaFunction || ""}
          onChange={(e) => setLambdaFunction(e.target.value)}
          sx={{ mb: 0 }}
          displayEmpty
        >
          <MenuItem value="" disabled>Select Lambda</MenuItem>
          <MenuItem value="team5-credit">team5-credit</MenuItem>
        </Select>
      </Box>

      </>
  );
}

