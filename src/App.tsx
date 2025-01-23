import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import { createTheme } from '@mui/material/styles';
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
    segment: 'infrastructureMetrics',
    title: 'Infrastructure Metrics',
    icon: <FolderIcon/>,
    children: [
    {
      segment: 'saturation',
      title: 'Saturation',
      icon: <DescriptionIcon/>
    }
    ]
  },
  {
    segment: 'networkMetrics',
    title: 'Network Metrics',
    icon: <FolderIcon />,
    children: [
      {
        segment: 'latency',
        title: 'Latency',
        icon: <ShoppingCartIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <ShoppingCartIcon />,
      }
    ],
  },
  {
    segment: 'orders',
    title: 'Customer List',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'infrastructureMetrics',
    title: 'Infrastructure Metrics',
    icon: <DashboardIcon />
  }
];

const BRANDING = {
  title: 'InsightGuard',
};

const customTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          //default: '#F5F5F5', //'#F9F9FE',
          //paper: '#F5F5F5'//#EEEEF9',
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: '#2A4364',
          paper: '#112E4D',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default function App() {
  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      theme={customTheme}
    >
      <Outlet />
    </AppProvider>
  );
}