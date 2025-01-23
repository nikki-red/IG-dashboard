import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import CustomerListPage from './pages/customer_list';
import InfrastructureMetrics from './pages/infrastructure_metrics_old';
import Saturation_EC2_Page from './pages/Infrastructure Metrics/saturation_ec2_instance_page';
import Latency_API_Gateway_Page from './pages/Network Metrics/Latency/latency_api_gateway_page';
import Traffic_Lambda_Page from './pages/Network Metrics/Traffic/traffic_lambda_page';
const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '',
            Component: DashboardPage,
          },
          {
            path:'infrastructureMetrics',
            children: [
              {
                path: 'saturation',
                Component: Saturation_EC2_Page
              }
            ]
          },
          {
            path:'networkMetrics',
            children: [
              {
                path: 'latency',
                Component: Latency_API_Gateway_Page
              },
              {
                path: 'traffic',
                Component: Traffic_Lambda_Page,
              },
            ]
          },
          {
            path: 'orders',
            Component: CustomerListPage,
          },
          {
            path: 'infrastructureMetrics',
            Component: InfrastructureMetrics,
          }
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);