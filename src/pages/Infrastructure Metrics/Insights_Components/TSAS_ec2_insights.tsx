import { Box, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

const TSAS_EC2InsightsComponent = () => {
    const [ec2Insights, setEc2Insights] = useState(null);
    const [isLoadingInsights, setIsLoadingInsights] = useState(true);
    useEffect(() => {
        let mounted = true; // For cleanup

        const fetchEc2Insights = async () => {
            setIsLoadingInsights(true);
            try {
                const response = await fetch('https://rcrf0s9sb7.execute-api.us-east-1.amazonaws.com/default/y_ig_insights_2');
                const data = await response.json();
                
                if (mounted && data?.insights?.completion) {
                    const insightText = data.insights.completion.trim();
                    console.log('Fetched EC2 Insights:', insightText);
                    setEc2Insights(insightText);
                }
            } catch (error) {
                console.error('Error fetching EC2 insights:', error);
                if (mounted) {
                    setEc2Insights('Error loading insights. Please try again.');
                }
            } finally {
                if (mounted) {
                    setIsLoadingInsights(false);
                }
            }
        };

        fetchEc2Insights();

        // Cleanup function
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <>
                <Grid item xs={12}>
                    <Typography variant="h6">EC2 Insights:</Typography>
                    {isLoadingInsights ? (
                        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                        <CircularProgress />
                    </Box>
                    ) : ec2Insights ? (
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', p: 1, bgcolor: 'white', borderRadius: '4px' }}>
                            {ec2Insights}
                        </Typography>
                    ) : (
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            Error loading insights. Please try again.
                        </Typography>
                    )}
                </Grid>
        
        </>
    )
}

export default TSAS_EC2InsightsComponent;
