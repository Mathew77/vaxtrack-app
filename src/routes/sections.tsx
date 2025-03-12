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
export const VaccineRequestPage = lazy(() => import('src/pages/vaccine-request/index'));
export const TablePage = lazy(() => import('src/pages/table'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const Page404 = lazy(() => import('src/pages/page-not-found/index'));
export const UhfHome = lazy(() => import('src/pages/uhf/home'));
export const AdminHome = lazy(() => import('src/pages/admin/home'));
export const EhfHome = lazy(() => import('src/pages/ehf/home'));
export const ConveyorHome = lazy(() => import('src/pages/conveyor/home'));
// export const ConveyorAllocation = lazy(() => import('src/pages/conveyor-allocation'));
export const VaccineConveyorPage = lazy(() => import('src/pages/vaccine-conveyor/index'));

export const LcsHome = lazy(() => import('src/pages/lcs/home'));
export const SlwgHome = lazy(() => import('src/pages/slwg/home'));
export const ThreeplHome = lazy(() => import('src/pages/threepl/home'));
export const Unauthorized = lazy(() => import('src/pages/unauthorized/index'));
export const ScsHome = lazy(() => import('src/pages/scs/home'));

//Admin conponents
// export const EhfSetup = lazy(() => import('src/pages/admin/ehf-uhf/ehf/ehf-setup'));

//export const UserManagement = lazy(() => import('src/pages/admin/user-management/users/user-setup'));
//export const RoleSetup = lazy(() => import('src/pages/admin/roles-permissions/role/role-setup'));
//export const PermissionSetup = lazy(() => import('src/pages/admin/roles-permissions/permission/permission-setup'));
//export const UhfSetup = lazy(() => import('src/pages/admin/ehf-uhf/uhf/uhf-setup'));

export const UserManagement = lazy(() => import('src/pages/admin/users/index'));
export const EhfUHFPage = lazy(() => import('src/pages/admin/ehf-uhf/index'));
export const LcsSCSPage = lazy(() => import('src/pages/admin/lcs-scs/index'));
export const RolesPermissionsPage = lazy(() => import('src/pages/admin/roles-permissions/index'));
export const OrgUnitPage = lazy(() => import('src/pages/admin/org-unit/index'));
export const ThreePlPage = lazy(() => import('src/pages/admin/threepl/index'));
export const ZonePage = lazy(() => import('src/pages/admin/zone/index'));

// export const ScsSetup = lazy(() => import('src/pages/admin/lcs-scs/scs/scs-setup'));
export const CommunityVaccine = lazy(() => import('src/pages/admin/community/community-setup'));
// export const OrgUnitSetup = lazy(() => import('src/pages/admin/org-unit/orgUnit-setup'));

// export const LcsScsSetup = lazy(() => import('src/pages/admin/lcs-scs/lcs-scs-setup'));
export const UserManagementSetup = lazy(() => import('src/pages/admin/user-management/user-management-setup'));
// export const ConveyorAllocationSetup  = lazy(() => import('src/pages/admin/user-management/user-management-setup'));

export const UserSetup = lazy(() => import('src/sections/admin/users/user-setup'));
export const EhfSetup = lazy(() => import('src/sections/admin/ehf-uhf/ehf/ehf-setup'));
export const UhfSetup = lazy(() => import('src/sections/admin/ehf-uhf/uhf/uhf-setup'));
export const LcsSetup = lazy(() => import('src/sections/admin/lcs-scs/lcs/lcs-setup'));
export const ScsSetup = lazy(() => import('src/sections/admin/lcs-scs/scs/scs-setup'));
export const RolesSetup = lazy(() => import('src/sections/admin/roles-permissions/role/role-setup'));
export const PermissionsSetup = lazy(() => import('src/sections/admin/roles-permissions/permission/permission-setup'));
export const ThreePlSetup = lazy(() => import('src/sections/admin/threepl/threepl-setup'));
export const ZoneSetup = lazy(() => import('src/sections/admin/zone/zone-setup'));


//Test page
export const TestPage = lazy(() => import('src/pages/test-page'));

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
      path: '/sign-in',
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
        { path: 'vaccine-page', element: <VaccineRequestPage /> },
        { path: 'table', element: <TablePage /> },
        // { path: 'conveyor', element: <ConveyorAllocation /> },
        // { path: 'blog', element: <BlogPage /> },
        { path: 'uhf-home', element: <UhfHome /> },
        { path: 'admin-home', element: <AdminHome /> },
        { path: 'ehf-home', element: <EhfHome /> },
        { path: 'lcs-home', element: <LcsHome /> },
        { path: 'slwg-home', element: <SlwgHome /> },
        { path: 'threepl-home', element: <ThreeplHome /> },
        { path: 'conveyor-home', element: <ConveyorHome /> },
        { path: 'vaccine-conveyor-page', element: <VaccineConveyorPage /> },
        { path: 'scs-home', element: <ScsHome /> },
        //Admin route menu and components
        { path: 'ehf-setup', element: <EhfSetup /> },
        { path: 'uhf-setup', element: <UhfSetup /> },
        { path: 'lcs-setup', element: <LcsSetup /> },
        { path: 'threepl-setup', element: <ThreePlSetup /> },
        { path: 'user-management', element: <UserManagement /> },
        { path: 'role-setup', element: <RolesSetup /> },
        { path: 'permission-setup', element: <PermissionsSetup /> },
        { path: 'scs-setup', element: <ScsSetup /> },
        { path: 'org-unit-page', element: <OrgUnitPage /> },

        { path: 'roles-permissions-page', element: <RolesPermissionsPage /> },

        { path: 'user-management-setup', element: <UserManagementSetup /> },

        { path: 'user-setup', element: <UserSetup /> },

        { path: 'ehf-uhf-page', element: <EhfUHFPage /> },

        { path: 'lcs-scs-page', element: <LcsSCSPage /> },
        { path: 'threepl-page', element: <ThreePlPage /> },
        { path: 'zone-page', element: <ZonePage /> },
        { path: 'zone-setup', element: <ZoneSetup /> },


        //TestPage
        { path: 'test-page', element: <TestPage /> },
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