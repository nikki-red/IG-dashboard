import { Table, TableHead, TableBody, TableRow, Typography, Box } from '@mui/material';
import { TableCell } from '@mui/material';
import { TableContainer } from '@mui/material';
import { Paper } from '@mui/material';
import { Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Tooltip } from '@mui/material';
export default function LambdaTable({ classifiedData }) {
  return (
    <>
      <Grid item xs={12}>
        <Tooltip
          title={
            <Box>
              <Typography variant="body2">Model: Isolation Forest</Typography>
              <Typography variant="body2">Date Range: Oct-12 - Nov-29</Typography>
            </Box>
          }
          arrow
          placement="left"
        >
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              mb: 1,
              color: '#1976d2',
              fontWeight: 600,
              cursor: 'default',
              ml: 2
            }}
          >
            - Detailed Peak Traffic Metrics
          </Typography>
        </Tooltip>
        <Paper elevation={2} sx={{ p: 2, bgcolor: '#f5f5f5', }}>

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
    </>
  )
}