import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Outlet } from 'react-router-dom';
import { AppProvider, type Navigation } from '@toolpad/core/react-router-dom';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Customer List',
    icon: <ShoppingCartIcon />,
  },
  { 
    segment: 'infrastructureMetrics',
    title: 'Infrastructure Metrics',
    icon: <DashboardIcon/>
  }
];

const BRANDING = {
  title: 'ABC Bank',
};

export default function App() {
  return (
    <AppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </AppProvider>
  );
}