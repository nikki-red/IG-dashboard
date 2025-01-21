import { Button, Paper } from '@mui/material';
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import React, {useState, useEffect} from 'react';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

export default function LambdaInsights() {
    const [insights, setInsights] = useState();
    const [isLoadingInsights, setIsLoadingInsights] = useState(true);
    const [showFullText, setShowFullText] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        console.log('useEffect triggered');
    
        const fetchInsights = async () => {
          console.log('Starting fetch');
          try {
            const response = await fetch('https://fxza7y0toi.execute-api.us-east-1.amazonaws.com/default/IG_lambda_insights');
            const data = await response.json();
            console.log('Response data:', data);
    
            // Direct access to insights property
            if (data.insights) {
              console.log('Setting insights:', data.insights);
              setInsights(data.insights);
              setHasError(false);
            } else {
              console.log('No insights found in response');
              setHasError(trye);
            }
          } catch (error) {
            console.error('Fetch error:', error);
          } finally {
            setIsLoadingInsights(false);
          }
        };
    
        fetchInsights();
      }, []);
      const renderInsights = () => {
        if (!insights) return null;

        const maxLength = 200; // Maximum number of characters to show before "Read More"
        const isLongText = insights.length > maxLength;
        //console.log('ec2Insights:', ec2Insights.length);
        const displayedText = showFullText || !isLongText ? insights : insights.substring(0, maxLength) + '...';

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
            /*
                sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    whiteSpace: 'pre-line',
                }}*/
                    sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <LightbulbOutlinedIcon
                        sx={{
                            mr: 2,
                            color: '#1976d2',
                            fontSize: 24
                        }}
                    />

                <Typography variant="body1" sx={{
                            lineHeight: 1.6,
                            color: '#333',
                            flex: 1,
                            whiteSpace: 'pre-line'
                        }}>
                    {displayedText}
                </Typography>
                </Box>
                {isLongText && (
                    <Box display="flex" justifyContent="flex-end"  sx={{ mt: 2 }}>

                        <Button variant="text" onClick={() => setShowFullText(!showFullText)} sx={{
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
            <Grid item xs={12} sx={{ mb: 8, mt: 2}}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6"
                    sx={{
                        mb: 3,              // Remove bottom margin
                        mt: 2,
                        minWidth: 'fit-content' // Prevent text wrapping
                    }}
                    gutterBottom
                >
                    Lambda Insights:
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
}