import { Typography } from '@mui/material';
import { List, ListItemText, ListItem, Paper } from '@mui/material';
import { Grid } from '@mui/material';
import React from 'react';

export default function SourceDetails({ ec2Instance }) {
  return (
    <>
      {/* <Typography variant="h6" gutterBottom>Source Details:</Typography> */}
      <Grid container spacing={3} sx={{
        mb: 2,
        width: 'calc(100% + 24px)', // Compensate for the negative margin
        ml: '-24px',  // Negative margin to offset parent padding
        mr: '-24px',  // Remove right margin
        '& .MuiGrid-item': {
          pl: '24px'  // Restore left padding for grid items
        }
      }}>
        {/* Instance Details Column */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              bgcolor: '#f5f5f5',
              '&:hover': { boxShadow: 3 }
            }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#2196f3' }}>
              Instance Details
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Instance Type"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 't3.2xlarge' : 't2.xlarge'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Instance ID"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 'i-0001324e481555bb7' : 'i-08a4986ef5bc41d72'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="vCPUs"
                  secondary="8"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Virtualization Type"
                  secondary="hvm"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Network Details Column */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              bgcolor: '#f5f5f5',
              '&:hover': { boxShadow: 3 }
            }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#2196f3' }}>
              Network Details
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Region"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 'us-east-1' : 'ap-south-1'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="VPC"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 'vpc-0a8f8b2c7d9e6f4a1' : 'vpc-1234567890abcdef0'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Subnet"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 'subnet-0123456789abcdef0' : 'subnet-abcdef0123456789'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Security Group"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 'sg-0123456789abcdef0' : 'sg-abcdef0123456789'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Other Details Column */}
        <Grid item xs={12} md={4} >
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              bgcolor: '#f5f5f5',
              '&:hover': { boxShadow: 3 }
            }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#2196f3' }}>
              Other Details
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="AMI ID"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 'ami-0123456789abcdef0' : 'ami-abcdef0123456789'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Launch Time"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? '2023-12-01' : '2023-11-15'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Tags"
                  secondary={ec2Instance === 'TSAS-StreamlitHost' ? 'TSAT' : 'Team5'}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Status"
                  secondary="Running"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}