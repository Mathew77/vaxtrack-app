import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const UserPage = lazy(() => import('src/pages/user'));
export const VaccinePage = lazy(() => import('src/pages/vaccines'));
export const TablePage = lazy(() => import('src/pages/table'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const UhfHome = lazy(() => import('src/pages/uhf/home'));
export const AdminHome = lazy(() => import('src/pages/admin/home'));
export const EhfHome = lazy(() => import('src/pages/ehf/home'));

export const LccoHome = lazy(() => import('src/pages/lcco/home'));
export const SlwgHome = lazy(() => import('src/pages/slwg/home'));
export const ThreeplHome = lazy(() => import('src/pages/threepl/home'));
export const Unauthorized = lazy(() => import('src/pages/unauthorized'));
//Admin conponents
export const EhfSetup = lazy(() => import('src/pages/admin/ehf/ehf-setup'));
export const UserManagement = lazy(() => import('src/pages/admin/users/user-setup'));
export const RoleSetup = lazy(() => import('src/pages/admin/role/role-setup'));
export const PermissionSetup = lazy(() => import('src/pages/admin/permission/permission-setup'));
export const UhfSetup = lazy(() => import('src/pages/admin/uhf/uhf-setup'));
export const LccoSetup = lazy(() => import('src/pages/admin/lcco/lcco-setup'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      path: '',
      element: (
        <AuthLayout>
          <Suspense fallback={renderFallback}>
            <SignInPage />
          </Suspense>
        </AuthLayout>
      ),
      index: true
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <Suspense fallback={renderFallback}>
            <SignInPage />
          </Suspense>
        </AuthLayout>
      ),
    },
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: 'home', element: <HomePage /> },
        { path: 'user', element: <UserPage /> },
        // { path: 'products', element: <ProductsPage /> },
        { path: 'vaccines', element: <VaccinePage /> },
        { path: 'table', element: <TablePage /> },
        // { path: 'blog', element: <BlogPage /> },
        { path: 'uhf-home', element: <UhfHome /> },
        { path: 'admin-home', element: <AdminHome /> },
        { path: 'ehf-home', element: <EhfHome /> },
        { path: 'lcco-home', element: <LccoHome /> },
        { path: 'slwg-home', element: <SlwgHome /> },
        { path: 'threepl-home', element: <ThreeplHome /> },
        //Admin route menu and components
        { path: 'ehf-setup', element: <EhfSetup /> },
        { path: 'uhf-setup', element: <UhfSetup /> },
        { path: 'lcco-setup', element: <LccoSetup /> },
        { path: 'user-management', element: <UserManagement /> },
        { path: 'role-setup', element: <RoleSetup /> },
        { path: 'permission-setup', element: <PermissionSetup /> },
      ],
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: 'unauthorized',
      element: <Unauthorized />,
    },
  ]);
}