import React, { useEffect, useState } from 'react';
import { ToggleButtonGroup, ToggleButton, Box, Typography, Button } from '@mui/material';

export default function ModelButton({ ec2instance, ec2Models, setEc2Models }) {
    const [showToggleButtons, setShowToggleButtons] = useState(false);

    const handleToggle = () => {
        setShowToggleButtons(!showToggleButtons);
    };

    useEffect(() => {
        setShowToggleButtons(false);
        setEc2Models(['LSTM']); // Default model is LSTM
    }, [ec2instance, setEc2Models]);

    const handleModelChange = (event: React.MouseEvent<HTMLElement>, newModels: string[]) => {
        setEc2Models(newModels);
    };

    // Function to render appropriate toggle buttons based on EC2 instance
    const renderModelButtons = () => {
        if (ec2instance === 'TSAS-StreamlitHost') {
            return (
                <>
                    <ToggleButton value="LSTM" sx={{ height: '40px' }}>
                        <Typography variant="h6">LSTM</Typography>
                    </ToggleButton>
                    <ToggleButton value="ARIMA" sx={{ height: '40px' }}>
                        <Typography variant="h6">ARIMA</Typography>
                    </ToggleButton>
                </>
            );
        } else if (ec2instance === 'kidonteam5ec2') {
            return (
                <ToggleButton value="LSTM" sx={{ height: '40px' }}>
                    <Typography variant="h6">LSTM</Typography>
                </ToggleButton>
            );
        }
        return null;
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2, ml: 2 }}>
            <Box sx={{ display: 'flex', position: 'relative' }}>
                <Button
                    onClick={handleToggle}
                    variant={showToggleButtons ? 'contained' : 'outlined'}
                    sx={{
                        cursor: 'pointer',
                        p: 1,
                        height: '40px',
                        borderRadius: showToggleButtons ? '4px 0 0 4px' : '4px',
                        position: 'relative',
                        zIndex: 2,
                        textTransform: 'none',
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    <Typography variant="h6">Forecasting Models:</Typography>
                </Button>
                <Box
                    sx={{
                        position: 'absolute',
                        left: '100%',
                        display: 'flex',
                        overflow: 'hidden',
                        maxWidth: showToggleButtons ? '500px' : '0px',
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    <ToggleButtonGroup
                        value={ec2Models}
                        onChange={handleModelChange}
                        sx={{
                            height: '40px',
                            display: 'flex',
                            ml: 0,
                            opacity: showToggleButtons ? 1 : 0,
                            transition: 'opacity 0.3s ease-in-out',
                        }}
                    >
                        {renderModelButtons()}
                    </ToggleButtonGroup>
                </Box>
            </Box>
        </Box>
    );
}