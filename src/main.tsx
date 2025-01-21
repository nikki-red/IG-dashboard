import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import CustomerListPage from './pages/customer_list';
import InfrastructureMetrics from './pages/infrastructure_metrics_old';
import API_Gateway_Page from './pages/Network Metrics/API Gateway/api_gateway_page';
import Lambda_Page from './pages/Network Metrics/Lambda/lambda_page';

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
          },{
            path: 'apiGateway',
            Component: API_Gateway_Page,
          },{
            path: 'lambda', 
            Component: Lambda_Page,
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