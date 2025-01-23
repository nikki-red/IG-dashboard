import { Box, Button, Typography, Paper } from '@mui/material';
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

const EC2InsightsComponent = ({ ec2Instance }) => {
    const [ec2Insights, setEc2Insights] = useState(null);
    const [isLoadingInsights, setIsLoadingInsights] = useState(true);
    const [showFullText, setShowFullText] = useState(false);
    const [hasError, setHasError] = useState(false);
    //const staticInsights = 'Here are the key insights from the CPU utilization data: 1. Peak hour range: The peaks in CPU utilization occur mostly between 10am - 2pm and 3pm - 7pm. 2. Most frequent peak hours and counts: - 3pm - 4pm: 18 peaks - 11am - 12pm: 16 peaks - 10am - 11am: 13 peaks 3. Hourly trends: - The highest average CPU utilization is at 3pm (average 15.2%). - Other hours with high average utilization are 11am (14.1%), 4pm (13.9%), and 10am (12.8%). 4. Weekly trends: - Wednesday has the most peaks with 25 peaks. - Monday has the second most with 23 peaks. - Tuesday and Thursday both have 21 peaks each. 5. Patterns and recommendations: - There is a clear two peak period during mid-day and late afternoon. - CPU utilization peaks most frequently mid-week. - To handle peak utilization periods, recommend scaling up capacity by ~15% from 10am - 7pm, with the highest increases from 2pm - 5pm. - Increase capacity by ~10% on Mondays and Wednesdays in particular. - Target base capacity to handle average utilization of 10-11% during non-peak periods. In summary, the data shows dual daily peak periods and mid-week peaks in utilization. Scaling up capacity during high utilization hours and on peak days can help improve performance during demand spikes.'

    useEffect(() => {
        let mounted = true; // For cleanup

        const fetchEc2Insights = async () => {
            setIsLoadingInsights(true);
            try {
                let response;
                if (ec2Instance === 'TSAS-StreamlitHost') {
                    response = await fetch('https://fbdpo8kyjl.execute-api.us-east-1.amazonaws.com/default/y_ig_insights');
                }
                else if (ec2Instance === 'kidonteam5ec2') {
                    response = await fetch('https://rcrf0s9sb7.execute-api.us-east-1.amazonaws.com/default/y_ig_insights_1');
                }

                if (!response) {
                    console.log('Error fetching EC2 insights for ' + ec2Instance + ': No response');
                    return;
                }

                const data = await response.json();
                console.log('Raw data:', data); // Debug log

                if (mounted && data?.insights) {
                    if (typeof data.insights === 'string') {
                        // For TSAS-StreamlitHost
                        const insightText = data.insights;
                        setEc2Insights(insightText.trim());
                        setHasError(false);
                    } else if (typeof data.insights.completion === 'string') {
                        // For kidonteam5ec2
                        const insightText = data.insights.completion;
                        setEc2Insights(insightText.trim());
                        setHasError(false);
                    } else {
                        console.error('Invalid insight text format:', data.insights);
                        setEc2Insights(null);//setEc2Insights(null);
                        setHasError(true);
                    }
                } /*else {
                    console.error('Invalid data structure:', data);
                    setEc2Insights(null);
                }*/
            } catch (error) {
                console.error('Error fetching EC2 insights:', error);
                if (mounted) {
                    setEc2Insights(null);//setEc2Insights(null);
                    setHasError(true);
                }
            } finally {
                if (mounted) {
                    setIsLoadingInsights(false);
                }
            }
        };

        if (ec2Instance) {
            fetchEc2Insights();
        }

        return () => {
            mounted = false;
        };
    }, [ec2Instance]);

    const renderInsights = () => {
        if (!ec2Insights || hasError) {
            console.log('ec2Insights is null');
            return null;
            //setEc2Insights('Here are the key insights from the CPU utilization data: 1. Peak hour range: The peaks in CPU utilization occur mostly between 10am - 2pm and 3pm - 7pm. 2. Most frequent peak hours and counts: - 3pm - 4pm: 18 peaks - 11am - 12pm: 16 peaks - 10am - 11am: 13 peaks 3. Hourly trends: - The highest average CPU utilization is at 3pm (average 15.2%). - Other hours with high average utilization are 11am (14.1%), 4pm (13.9%), and 10am (12.8%). 4. Weekly trends: - Wednesday has the most peaks with 25 peaks. - Monday has the second most with 23 peaks. - Tuesday and Thursday both have 21 peaks each. 5. Patterns and recommendations: - There is a clear two peak period during mid-day and late afternoon. - CPU utilization peaks most frequently mid-week. - To handle peak utilization periods, recommend scaling up capacity by ~15% from 10am - 7pm, with the highest increases from 2pm - 5pm. - Increase capacity by ~10% on Mondays and Wednesdays in particular. - Target base capacity to handle average utilization of 10-11% during non-peak periods. In summary, the data shows dual daily peak periods and mid-week peaks in utilization. Scaling up capacity during high utilization hours and on peak days can help improve performance during demand spikes.');
        }
        console.log('ec2Insights:', ec2Insights);
        const maxLength = 300;
        const isLongText = ec2Insights.length > maxLength;
        const displayedText = showFullText || !isLongText ? ec2Insights : ec2Insights.substring(0, maxLength) + '...';

        return (
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    bgcolor: '#ffffff',
                    borderRadius: 1,
                    '&:hover': {
                        boxShadow: 3,
                        transition: 'box-shadow 0.3s ease-in-out'
                    }
                }}
            >
                <Box
                    sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <LightbulbOutlinedIcon
                        sx={{
                            mr: 2,
                            color: '#1976d2',
                            fontSize: 24
                        }}
                    />
                    <Typography
                        variant="body1"
                        sx={{
                            lineHeight: 1.6,
                            color: '#333',
                            flex: 1,
                            whiteSpace: 'pre-line'
                        }}
                    >
                        {displayedText}
                    </Typography>
                </Box>
                {isLongText && (
                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        sx={{ mt: 2 }}
                    >
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setShowFullText(!showFullText)}
                            sx={{
                                textTransform: 'none',
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                '&:hover': {
                                    borderColor: '#1565c0',
                                    bgcolor: 'rgba(25, 118, 210, 0.04)'
                                }
                            }}
                        >
                            {showFullText ? 'Show Less' : 'Read More'}
                        </Button>
                    </Box>
                )}
            </Paper>
        );
    };

    return (
        <Grid item xs={12} sx={{ mb: 8 }}>
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        mb: 3,              // Remove bottom margin
                        mt: 2,
                        minWidth: 'fit-content' // Prevent text wrapping
                    }}
                    gutterBottom
                >
                    EC2 Insights:
                </Typography>
                {isLoadingInsights ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            height: 200,
                            bgcolor: '#ffffff',
                            borderRadius: 2,
                            boxShadow: 1
                        }}
                    >
                        <CircularProgress sx={{ color: '#1976d2' }} />
                    </Box>
                ) : hasError ? (
                    <Typography variant="body1" sx={{ mt: 1, color: 'error.main' }}>
                        There was an error fetching the insights. Please try again later. Sorry for the inconvenience.
                    </Typography>
                ) : (
                    renderInsights()
                )}
            </Box>
        </Grid>
    );
};

export default EC2InsightsComponent;
