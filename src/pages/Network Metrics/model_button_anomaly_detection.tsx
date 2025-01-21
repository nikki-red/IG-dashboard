import React, { useEffect, useState } from 'react';
import { ToggleButtonGroup, ToggleButton, Box, Typography, Button } from '@mui/material';

export default function ModelButtonAnomalyDetection({ apiType, apiModelsAnomaly, setApiModelsAnomaly }) {
    const [showToggleButtons, setShowToggleButtons] = useState(false);

    const handleToggle = () => {
        setShowToggleButtons(!showToggleButtons);
    };

    useEffect(() => {
        setShowToggleButtons(false);
        setApiModelsAnomaly(['Isolation Forest']);
    }, [apiType, setApiModelsAnomaly]);

    const handleModelChange = (event: React.MouseEvent<HTMLElement>, newModels: string[]) => {
        setApiModelsAnomaly(newModels);
    };

    // Function to render appropriate toggle buttons based on EC2 instance
    const renderModelButtons = () => {
        if (apiType === 'team5-credit-API') {
            return (
                <>
                    <ToggleButton value="Isolation Forest" sx={{ height: '40px' }}>
                        <Typography variant="h6">Isolation Forest</Typography>
                    </ToggleButton>
                </>
            );
        }
        return null;
    };



    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, ml: 2 }}>
                <Button
                    onClick={handleToggle}
                    variant={showToggleButtons ? 'contained' : 'outlined'}
                    sx={{
                        cursor: 'pointer',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        height: '40px',
                        mr: -1,
                        borderRadius: showToggleButtons ? '4px 0 0 4px' : '4px 4px 4px 4px',
                        position: 'relative',
                        zIndex: 1,
                        textTransform: 'none',
                    }}
                >
                    <Typography variant="h6">Anomaly Detection Models:</Typography>
                </Button>
                <Box
                    sx={{
                        display: 'flex',
                        overflow: 'hidden',
                        transition: 'max-width 0.5s ease-in-out',
                    }}
                >
                    <ToggleButtonGroup
                        value={apiModelsAnomaly}   
                        onChange={handleModelChange}
                        sx={{
                            ml: 1,
                            height: '40px',
                            display: 'flex',
                            transition: 'transform 0.5s ease-in-out',
                            transform: showToggleButtons ? 'translateX(0)' : 'translateX(-100%)',
                        }}
                    >
                        {renderModelButtons()}
                    </ToggleButtonGroup>
                </Box>
            </Box>
            
        </>
    );
}