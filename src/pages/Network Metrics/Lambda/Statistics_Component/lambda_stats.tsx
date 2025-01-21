import { Grid, Paper, Typography } from '@mui/material';
import { Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
export default function LambdaInsights({ classifiedData }) {
    return (
        <>
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
        </>
    );
}
