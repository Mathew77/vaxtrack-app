import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { DashboardLayout } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';

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
export const MccoHome = lazy(() => import('src/pages/mcco/home'));
export const ConveyorAllocation = lazy(() => import('src/pages/conveyor-allocation'));
export const VaccineAllocationPage = lazy(() => import('src/pages/vaccine-allocation/index'));
export const VaccineAllocationStockPage = lazy(() => import('src/pages/vaccine-allocation-stock/index'));
export const WayBillInvoicePage = lazy(() => import('src/pages/invoice/index'));

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
export const NcsPage = lazy(() => import('src/pages/admin/ncs/index'));
export const ReportForms = lazy(() => import('src/pages/admin/report'));
export const UploadPage = lazy(() => import('src/pages/admin/upload-stock'));
export const UploadView = lazy(() => import('src/sections/admin/upload-stock/upload-view'));
export const StockEditView = lazy(() => import('src/sections/admin/upload-stock/stock-edit-view'));

// export const ScsSetup = lazy(() => import('src/pages/admin/lcs-scs/scs/scs-setup'));
export const CommunityVaccine = lazy(() => import('src/pages/admin/community/community-setup'));
// export const OrgUnitSetup = lazy(() => import('src/pages/admin/org-unit/orgUnit-setup'));

// export const LcsScsSetup = lazy(() => import('src/pages/admin/lcs-scs/lcs-scs-setup'));
export const UserManagementSetup = lazy(() => import('src/pages/admin/user-management/user-management-setup'));
// export const ConveyorAllocationSetup  = lazy(() => import('src/pages/admin/user-management/user-management-setup'));

export const UserSetup = lazy(() => import('src/sections/admin/users/user-setup'));
export const EhfSetup = lazy(() => import('src/sections/admin/ehf-uhf/ehf/ehf-setup'));
export const EhfView = lazy(() => import('src/pages/ehf-view/index'));
export const UhfSetup = lazy(() => import('src/sections/admin/ehf-uhf/uhf/uhf-setup'));
export const LcsSetup = lazy(() => import('src/sections/admin/lcs-scs/lcs/lcs-setup'));
export const ScsSetup = lazy(() => import('src/sections/admin/lcs-scs/scs/scs-setup'));
export const RolesSetup = lazy(() => import('src/sections/admin/roles-permissions/role/role-setup'));
export const PermissionsSetup = lazy(() => import('src/sections/admin/roles-permissions/permission/permission-setup'));
export const ThreePlSetup = lazy(() => import('src/sections/admin/threepl/threepl-setup'));
export const ZoneSetup = lazy(() => import('src/sections/admin/zone/zone-setup'));
// export const OrgUnitSetup = lazy(() => import('src/sections/admin/org-unit-org-level/org-unit/org-unit-setup'));
export const OrgLevelSetup = lazy(() => import('src/sections/admin/org-unit-org-level/org-level/org-level-setup'));
export const NcsSetup = lazy(() => import('src/sections/admin/ncs/ncs-setup'));

export const WayBillDetails = lazy(() => import('src/sections/invoice/waybill-details'));

export const VaccineView = lazy(() => import('src/sections/vaccine-allocation/view/vaccines-view'));
export const VaccineRequestForm = lazy(() => import('src/sections/vaccine/view/vaccines-request-view'));
export const VaccineAllocationStockView = lazy(() => import('src/sections/vaccine-allocation-stock/vaccine-allocation-view/vaccine-allocation-stock-view'));
export const VaccineAllocationConfirmPage = lazy(() => import('src/pages/vaccine-allocation-confirm/index'));
export const VaccineAllocationMccoConfirmPage = lazy(() => import('src/pages/vaccine-allocation-mcco-confirm/index'));
export const VaccineAllocationLcsReturnPage = lazy(() => import('src/pages/vaccine-allocation-lcs-return/index'));
export const BatchDetailPage = lazy(() => import('src/pages/vaccine-allocation-stock/batch-detail'));
export const VaccineAllocationBulkFormPage = lazy(() => import('src/pages/vaccine-allocation-bulk-form/index'));


//Test page
export const TestPage = lazy(() => import('src/pages/test-page'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box
    sx={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      bgcolor: 'rgba(255, 255, 255, 0.95)',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
    }}
  >
    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer rotating ring with glow */}
      <CircularProgress
        size={140}
        thickness={2.5}
        sx={{
          color: 'rgb(12, 125, 64)',
          opacity: 0.4,
          filter: 'blur(2px)'
        }}
      />
      {/* Main rotating ring */}
      <CircularProgress
        size={140}
        thickness={3}
        sx={{
          color: 'rgb(12, 125, 64)',
          position: 'absolute',
          left: 0,
          animationDuration: '1.2s',
          filter: 'drop-shadow(0 0 8px rgba(12, 125, 64, 0.4))'
        }}
        variant="indeterminate"
      />
      {/* Counter-rotating inner ring */}
      <CircularProgress
        size={110}
        thickness={2}
        sx={{
          color: 'rgba(12, 125, 64, 0.6)',
          position: 'absolute',
          left: 0,
          right: 0,
          margin: 'auto',
          animation: 'rotate-reverse 2s linear infinite',
          '@keyframes rotate-reverse': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(-360deg)' }
          }
        }}
        variant="indeterminate"
      />
      {/* Center pulsing icon */}
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse-scale 2s ease-in-out infinite',
          '@keyframes pulse-scale': {
            '0%, 100%': { transform: 'scale(1)', opacity: 1 },
            '50%': { transform: 'scale(1.1)', opacity: 0.8 }
          }
        }}
      >
        <Iconify
          icon="healthicons:medicines"
          width={60}
          sx={{
            color: 'rgb(12, 125, 64)',
            filter: 'drop-shadow(0 2px 8px rgba(12, 125, 64, 0.3))'
          }}
        />
      </Box>
    </Box>
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: 'rgb(12, 125, 64)',
          mb: 1,
          animation: 'fade-in-out 1.5s ease-in-out infinite',
          '@keyframes fade-in-out': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.5 }
          }
        }}
      >
        Loading.........
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontStyle: 'italic',
          fontWeight: 500
        }}
      >
        Please wait
      </Typography>
    </Box>
  </Box>
);

export function Router() {
  return useRoutes([
    {
      path: '',
      element: (
        <Suspense fallback={renderFallback}>
          <SignInPage />
        </Suspense>
      ),
      index: true
    },
    {
      path: '/sign-in',
      element: (
        <Suspense fallback={renderFallback}>
          <SignInPage />
        </Suspense>
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
        { path: 'waybill-invoice-page', element: <WayBillInvoicePage /> },
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
        { path: 'mcco-home', element: <MccoHome /> },
        { path: 'vaccine-allocation-page', element: <VaccineAllocationPage /> },
        { path: 'vaccine-allocation-stock-page', element: <VaccineAllocationStockPage /> },
        { path: 'scs-home', element: <ScsHome /> },
        //Admin route menu and components
        { path: 'ehf-setup', element: <EhfSetup /> },
        { path: 'ehf-view', element: <EhfView /> },
        { path: 'uhf-setup', element: <UhfSetup /> },
        { path: 'lcs-setup', element: <LcsSetup /> },
        { path: 'threepl-setup', element: <ThreePlSetup /> },
        { path: 'user-management', element: <UserManagement /> },
        { path: 'role-setup', element: <RolesSetup /> },
        { path: 'permission-setup', element: <PermissionsSetup /> },
        { path: 'scs-setup', element: <ScsSetup /> },
        { path: 'org-units-page', element: <OrgUnitPage /> },

        { path: 'roles-permissions-page', element: <RolesPermissionsPage /> },

        { path: 'user-management-setup', element: <UserManagementSetup /> },

        { path: 'user-setup', element: <UserSetup /> },

        { path: 'ehf-uhf-page', element: <EhfUHFPage /> },

        { path: 'lcs-scs-page', element: <LcsSCSPage /> },
        { path: 'threepl-page', element: <ThreePlPage /> },
        { path: 'zone-page', element: <ZonePage /> },
        { path: 'zone-setup', element: <ZoneSetup /> },
        // { path: 'org-unit-setup', element: <OrgUnitSetup /> },
        { path: 'org-level-setup', element: <OrgLevelSetup /> },

        { path: 'ncs-page', element: <NcsPage /> },
        { path: 'ncs-setup', element: <NcsSetup /> },

        { path: 'waybill-details', element: <WayBillDetails /> },

        { path: 'vaccine-view', element: <VaccineView /> },
        { path: 'vaccine-request-view', element: <VaccineRequestForm /> },
        { path: 'vaccine-allocation-stock-view', element: <VaccineAllocationStockView /> },
        { path: 'vaccine-allocation-confirm-view', element: <VaccineAllocationConfirmPage /> },
        { path: 'vaccine-allocation-mcco-confirm', element: <VaccineAllocationMccoConfirmPage /> },
        { path: 'vaccine-allocation-lcs-return', element: <VaccineAllocationLcsReturnPage /> },
        { path: 'vaccine-allocation-batch-detail', element: <BatchDetailPage /> },
        { path: 'vaccine-allocation-bulk-form', element: <VaccineAllocationBulkFormPage /> },

        { path: 'report', element: <ReportForms /> },
        { path: 'maximum-stock', element: <UploadPage /> },
        { path: 'upload-view', element: <UploadView /> },
        { path: 'stock-edit-view', element: <StockEditView /> },


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