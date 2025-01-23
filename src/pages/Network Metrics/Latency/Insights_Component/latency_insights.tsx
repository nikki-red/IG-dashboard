import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, CircularProgress, Paper } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
const LatencyInsightsComponent = ({ apiGateway }) => {
    const [apiGatewayInsights, setApiGatewayInsights] = useState(null);
    const [isLoadingInsights, setIsLoadingInsights] = useState(true);
    const [showFullText, setShowFullText] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchApiGatewayInsights = async () => {
            try {
                const response = await fetch('https://iufi14jew0.execute-api.us-east-1.amazonaws.com/default/IG_API_insights');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                console.log('Fetched data:', data); // Debug log

                const jsonString = data.insights
                    .replace('```json\n', '')
                    .replace('\n```', '')
                    .trim();

                const parsedInsights = JSON.parse(jsonString);
                setApiGatewayInsights(parsedInsights);
                setHasError(false);
            } catch (error) {
                console.error('Error fetching API Gateway insights:', error);
                setHasError(true);
            } finally {
                setIsLoadingInsights(false); // Ensure this is called in both success and error cases
            }
        };
        fetchApiGatewayInsights();
    }, [apiGateway]);

    const renderInsights = () => {
        if (!apiGatewayInsights) return null;

        const insightsText = `
            Key Statistics:
            • Min Latency: ${apiGatewayInsights.key_statistics.min} ms
            • Max Latency: ${apiGatewayInsights.key_statistics.max} ms
            • Mean Latency: ${apiGatewayInsights.key_statistics.mean.toFixed(2)} ms
            • Median Latency: ${apiGatewayInsights.key_statistics.median.toFixed(2)} ms

            Percentiles:
            • 25th: ${apiGatewayInsights.key_statistics.percentiles['25th'].toFixed(2)} ms
            • 50th: ${apiGatewayInsights.key_statistics.percentiles['50th'].toFixed(2)} ms
            • 75th: ${apiGatewayInsights.key_statistics.percentiles['75th'].toFixed(2)} ms
            • 90th: ${apiGatewayInsights.key_statistics.percentiles['90th'].toFixed(2)} ms
            • 95th: ${apiGatewayInsights.key_statistics.percentiles['95th'].toFixed(2)} ms

            Standard Deviation: ${apiGatewayInsights.key_statistics.std_dev.toFixed(2)} ms

            Temporal Patterns:
            Hourly Patterns:${apiGatewayInsights.temporal_patterns.hourly_patterns.map(pattern =>
            `\n  • Hour ${pattern.hour}: ${pattern.pattern}`
        ).join('')}

            Daily Patterns:${apiGatewayInsights.temporal_patterns.daily_patterns.map(pattern =>
            `\n  • ${pattern.day}: ${pattern.pattern}`
        ).join('')}

            Recurring Spikes: ${apiGatewayInsights.temporal_patterns.recurring_spikes}

            Stability: ${apiGatewayInsights.temporal_patterns.stability}

            Performance Analysis:
            Overall Performance: ${apiGatewayInsights.performance_analysis.overall_performance}

            Potential Issues:${apiGatewayInsights.performance_analysis.potential_issues.map(issue =>
            `\n  • ${issue}`
        ).join('')}

            Optimization Areas:${apiGatewayInsights.performance_analysis.optimization_areas.map(area =>
            `\n  • ${area}`
        ).join('')}

            Anomaly Detection:
            Unusual Patterns:${apiGatewayInsights.anomaly_detection.unusual_patterns.map(pattern =>
            `\n  • ${pattern}`
        ).join('')}

            Potential Causes:${apiGatewayInsights.anomaly_detection.potential_causes.map(cause =>
            `\n  • ${cause}`
        ).join('')}
        `;

        const maxLength = 300; // Adjust this value as needed
        const isLongText = insightsText.length > maxLength;
        const displayedText = showFullText || !isLongText ? insightsText : insightsText.substring(0, maxLength) + '...';

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
                    sx={{
                        display: 'flex', alignItems: 'flex-start', mb: 2
                        /*
                        p: 2,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        whiteSpace: 'pre-line',*/
                    }}
                >
                    <LightbulbOutlinedIcon
                        sx={{
                            mr: 2,
                            color: '#1976d2',
                            fontSize: 24
                        }}
                    />
                    {/*<Typography component="pre" sx={{ whiteSpace: 'pre-line' }}>*/}
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
                    <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button variant="outlined" size="small" onClick={() => setShowFullText(!showFullText)}
                            sx={{
                                textTransform: 'none',
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                '&:hover': {
                                    borderColor: '#1565c0',
                                    bgcolor: 'rgba(25, 118, 210, 0.04)'
                                }
                            }}>
                            {showFullText ? 'Read Less' : 'Read More'}
                        </Button>
                    </Box>
                )}
            </Paper>
        );
    };


    return (
        <>
            <Grid item xs={12} sx={{ mb: 8 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,              // Remove bottom margin
                            mt: 2,
                            minWidth: 'fit-content' // Prevent text wrapping
                        }}
                    >
                        API Gateway Insights:
                    </Typography>
                    {isLoadingInsights ? (
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{
                            height: 200,
                            bgcolor: '#ffffff',
                            borderRadius: 2,
                            boxShadow: 1
                        }}>
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
        </>
    );
};

export default LatencyInsightsComponent;