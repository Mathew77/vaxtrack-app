//import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  // {
  //   title: 'Dashboard',
  //   path: '/home',
  //   icon: icon('ic-analytics'),
  //   roles: ['admin', 'ehf', 'uhf', 'lcs', 'slwg', 'threepl'],
  // },
//EHF Menu
  {
    title: 'Dashboard',
    path: '/ehf-home',
    icon: icon('ic-user'),
    roles: ['ehf'],
    children: [
      // { title: 'EHF Dashboard 1', path: '/ehf-home/dashboard1', roles: ['ehf', 'admin'] },
      // { title: 'EHF Dashboard 2', path: '/ehf-home/dashboard2', roles: ['ehf', 'admin'] },
      { title: 'EHF Dashboard 1', path: '/ehf-home/dashboard1', roles: ['', ] },
      { title: 'EHF Dashboard 2', path: '/ehf-home/dashboard2', roles: ['', ''] },
    ],
  },
  
  //UHF Menu
  {
    title: 'Dashboard',
    path: '/uhf-home',
    icon: icon('ic-analytics'),
    roles: ['uhf'],
    children: [
      { title: 'UHF Dashboard 1', path: '/uhf-home/dashboard1', roles: ['uhf', 'admin'] },
      { title: 'UHF Dashboard 2', path: '/uhf-home/dashboard2', roles: ['uhf', 'admin'] },
    ],
  },
  
  //LCS Menu
  {
    title: 'Dashboard',
    path: '/lcs-home',
    icon: icon('ic-analytics'),
    roles: ['lcs'],
    children: [
      { title: 'LCS Dashboard 1', path: '/lcs-home/dashboard1', roles: ['lcs', 'admin'] },
      { title: 'LCS Dashboard 2', path: '/lcs-home/dashboard2', roles: ['lcs', 'admin'] },
    ],
  },

  {
    title: 'Dashboard',
    path: '/scs-home',
    icon: icon('ic-analytics'),
    roles: ['scs'],
    children: [
      { title: 'SCS Dashboard 1', path: '/scs-home/dashboard1', roles: ['scs', 'admin'] },
      { title: 'SCS Dashboard 2', path: '/scs-home/dashboard2', roles: ['scs', 'admin'] },
    ],
  },
  
  //SLWG Menu
  {
    title: 'Dashboard',
    path: '/slwg-home',
    icon: icon('ic-analytics'),
    roles: ['slwg'],
    children: [
      { title: 'SLWG Dashboard 1', path: '/slwg-home/dashboard1', roles: ['slwg', 'admin'] },
      { title: 'SLWG Dashboard 2', path: '/slwg-home/dashboard2', roles: ['slwg', 'admin'] },
    ],
  },
  
  //3PL & SCS  Menu
  {
    title: 'Dashboard',
    path: '/threepl-home',
    icon: icon('ic-analytics'),
    roles: ['threepl'],
    children: [
      { title: '3PL Dashboard 1', path: '/threepl-home/dashboard1', roles: ['threepl', 'admin'] },
      { title: '3PL Dashboard 2', path: '/threepl-home/dashboard2', roles: ['threepl', 'admin'] },
    ],
  },

  //Conveyor Menu
  {
    title: 'Dashboard',
    path: '/conveyor-home',
    icon: icon('ic-analytics'),
    roles: ['conveyor'],
  },

  //MCCO Menu
  {
    title: 'Dashboard',
    path: '/mcco-home',
    icon: icon('ic-analytics'),
    roles: ['mcco'],
  },
  
 
  //Adminsitratve  Menu
  {
    title: 'Dashboard',
    path: '/admin-home',
    icon: icon('ic-analytics'),
    roles: ['admin'],
  },
  {
    title: 'User Management',
    path: '/user-management',
    icon: icon('ic-user'),
    roles: ['admin'],
  },
  {
    title: 'EHF & UHF Setup',
    path: '/ehf-uhf-page',
    icon: icon('ic-facility'),
    roles: ['admin'],
  },
  {
    title: 'LCS & SCS Setup',
    path: '/lcs-scs-page',
    icon: icon('ic-local'),
    roles: ['admin'],
  },
  {
    title: 'Roles & Permissions Setup',
    path: '/roles-permissions-page',
    icon: icon('ic-access'),
    roles: ['admin'],
  },
  // {
  //   title: 'LCS SETUP',
  //   path: '/lcs-setup',
  //   icon: icon('ic-user'),
  //   roles: ['admin'],
  // },
  // {
  //   title: 'UHF SETUP',
  //   path: '/uhf-setup',
  //   icon: icon('ic-user'),
  //   roles: ['admin'],
  // },
  {
    title: '3PL SETUP',
    path: '/threepl-page',
    icon: icon('ic-logistic'),
    roles: ['admin'],
  },
  // {
  //   title: 'Role',
  //   path: '/role-setup',
  //   icon: icon('ic-user'),
  //   roles: ['admin'],
  // },
  // {
  //   title: 'Permission',
  //   path: '/permission-setup',
  //   icon: icon('ic-user'),
  //   roles: ['admin'],
  // },
  // {
  //   title: 'SCS',
  //   path: '/scs-setup',
  //   icon: icon('ic-user'),
  //   roles: ['admin'],
  // },
  {
    title: 'Organisation Unit',
    path: '/org-units-page',
    icon: icon('ic-org'),
    roles: ['admin'],
  },
  // {
  //   title: 'Zone Management',
  //   path: '/zone-page',
  //   icon: icon('ic-zone'),
  //   roles: ['admin'],
  // },
  {
    title: 'NSCS Setup',
    path: '/ncs-page',
    icon: icon('ic-local'),
    roles: ['admin'],
  },
  //Generic Menu 
  // {

  //   title: 'Vaccine Request',
  //   path: '/vaccine-page',
  //   icon: <MenuBookIcon />,
  //   roles: ['ehf', 'lcs', 'scs', 'threepl', 'slwg'],
  // },
  // {
  //   title: 'Vaccine Allocation',
  //   path: '/conveyor',
  //   icon: <MenuBookIcon />,
  //   roles: ['conveyor', 'ehf', 'uhf'],

  // },
  {
    title: 'Vaccine Allocation',
    path: '/vaccine-allocation-page',
    icon: <MenuBookIcon />,
    roles: ['ehf', 'uhf', 'threepl', 'conveyor'],
  },
  {
    title: 'Vaccine Allocation Stock',
    path: '/vaccine-allocation-stock-page',
    icon: icon('ic-community'),
    roles: ['slwg', 'scs', 'threepl', 'mcco', 'lcs'],
  },
  // {
  //   title: 'WayBill / Invoice',
  //   path: '/waybill-invoice-page',
  //   icon: <StackedLineChartIcon />,
  //   roles: ['threepl'],
  // },
  {
    title: 'Maximum Stock',
    path: '/maximum-stock',
    icon: icon('ic-lock'),
    roles: ['admin'],
  },
  {
    title: 'Report',
    path: '/report',
    icon: <StackedLineChartIcon />,
    roles: ['admin', 'scs','slwg'],
  },
  //test-page
  // {
  //   title: 'Test-Page',
  //   path: '/test-page',
  //   icon: icon('ic-blog'),
  //   roles: ['ehf','uhf','lcs','slwg','threepl', 'admin'],
  // },
];
