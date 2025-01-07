import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LineChart, BarChart, PieChart} from '@mui/x-charts';
import Alert from '@mui/material/Alert';  // For the alert box
import { Card, CardContent } from '@mui/material';
//import StatCard from './StatCard'; // Assuming it's a component you already have
//import HighlightedCard from './HighlightedCard'; // Assuming it's a component you already have

const frequencyData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const loanTypeData = [15, 25, 40, 20];  // Example data for loan types
const loanTypeLabels = ['Home', 'Car', 'Personal', 'Business'];
const intentData = [10, 20, 30];  // Example data for intent
const intentLabels = ['Interested', 'Slightly Interested', 'Not Interested'];
const xLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export default function DashboardPage() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* Overview Section */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        {/* Line Chart for Call Frequency */}
        <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
          <LineChart
            width={500}
            height={300}
            series={[{ data: frequencyData, label: 'Call Frequency' }]}
            xAxis={[{ scaleType: 'point', data: xLabels }]}
          />
        </Grid>

        {/* Alert Box */}
        <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
          <Alert severity="info">This is an alert box with some important information!</Alert>
        </Grid>
      </Grid>

      {/* Cards Section */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Statistics Overview
      </Typography>
      <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>No. of Calls</Typography>
              <Typography variant="h5">350</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Leads Generated</Typography>
              <Typography variant="h5">120</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Leads Converted</Typography>
              <Typography variant="h5">80</Typography>
            </CardContent>
          </Card>
        </Grid>


      {/* Loan Type Bar Chart */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Loan Type Distribution
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
          <BarChart
            width={500}
            height={300}
            series={[{ data: loanTypeData, label: 'Loan Types' }]}
            xAxis={[{ scaleType: 'band', data: loanTypeLabels }]}
          />
        </Grid>

        
      </Grid>

      {/* Footer */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Data Insights
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body1">
              Here are the insights derived from the loan types and intents of the users over time. The data indicates that there is an increasing trend in the 'Home' loan applications, and a larger portion of users are 'Interested' in the loans.
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            {/* Custom components like a tree view or country chart */}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

/*
import * as React from 'react';
import Grid from '@mui/material/Grid2'
import { Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { LineChart, BarChart, PieChart} from '@mui/x-charts';

const CallFrequencyData = {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    series: [
      {
        data: [50, 100, 75, 125, 150, 200, 180],
        color: '#4bc0c0', // Line color
      },
    ],
  };
  const LoanTypeData = {
    categories: ['Personal', 'Home', 'Car', 'Student'],
    series: [
      {
        data: [40, 60, 35, 25],
        color: '#ff6384', // Bar color
      },
    ],
  };
  
  const IntentData = {
    categories: ['Interested', 'Slightly Interested', 'Not Interested'],
    series: [
      {
        data: [300, 150, 50],
        color: '#36a2eb', // Pie color
      },
    ],
  };
  const frequencyData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const xLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
export default function DashboardPage() {
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Overview
            </Typography>
            <Grid
                container
                spacing={2}
                columns={12}
                sx={{ mb: (theme) => theme.spacing(2) }}
            >
                <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
                    <LineChart
                        width={800}
                        height={350}
                        series={[{ data: frequencyData, label: 'Call Frequency' }]}
                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}
export default function DashboardPage() {
  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
         Line Graph and Alert Box 
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Frequency of Calls (Monthly)
            </Typography>
            <LineChart 
            width={500}
            height={300}
            data={CallFrequencyData}
            series>
              <Typography>Call Frequency</Typography>
              <LineSeries valueField="data" categoryField="categories" />
            </LineChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Alerts
            </Typography>
            <Box sx={{ backgroundColor: '#ffcccb', padding: 2, borderRadius: '4px' }}>
              <Typography variant="body2">You have 3 pending follow-ups!</Typography>
            </Box>
          </Paper>
        </Grid>

        /* Cards (No. of Calls, Leads Generated, Leads Converted) 
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>No. of Calls</Typography>
              <Typography variant="h5">350</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Leads Generated</Typography>
              <Typography variant="h5">120</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Leads Converted</Typography>
              <Typography variant="h5">80</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Graph (Loan Type Counts) and Pie Chart (Intent) 
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Loan Type Distribution
            </Typography>
            <BarChart data={LoanTypeData}>
              <Title>Loan Type Distribution</Title>
              <BarSeries valueField="data" categoryField="categories" />
            </BarChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Intent Distribution
            </Typography>
            <PieChart data={IntentData}>
              <Title>Intent Distribution</Title>
              <PieSeries valueField="data" categoryField="categories" />
            </PieChart>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
*/