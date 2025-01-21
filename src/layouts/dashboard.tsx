// This is a layout component that:
// 1. Provides the common structure/layout for all pages
// 2. Wraps the page content with navigation, header, etc.
// 3. Renders child routes using <Outlet />

import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';

export default function Layout() {
  return (
    <DashboardLayout>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
