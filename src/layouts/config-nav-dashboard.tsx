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
    title: '3PL & SCS Dashboard',
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
    icon: icon('ic-user'),
    roles: ['conveyor'],
    children: [
      { title: 'Conveyor Dashboard 1', path: '/conveyor-home/dashboard1', roles: ['conveyor', 'admin'] },
      { title: 'Conveyor Dashboard 2', path: '/conveyor-home/dashboard2', roles: ['conveyor', 'admin'] },
    ],
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
    path: '/user-management-setup',
    icon: icon('ic-user'),
    roles: ['admin'],
  },
  {
    title: 'EHF & UHF Setup',
    path: '/ehf-uhf-setup',
    icon: icon('ic-facility'),
    roles: ['admin', 'lcs', 'slwg'],
  },
  {
    title: 'LCS & SCS Setup',

    path: '/lcs-scs-setup',

    icon: icon('ic-local'),
    roles: ['admin', 'slwg'],
  },
  {
    title: 'Roles & Permissions Setup',
    path: '/roles-permissions-setup',
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
    path: '/threepl-setup',
    icon: icon('ic-logistic'),
    roles: [''],
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
    path: '/org-unit',
    icon: icon('ic-org'),
    roles: ['admin'],
  },
  //Generic Menu 
  {

    title: 'Vaccine Request',
    path: '/vaccines',
    icon: <MenuBookIcon />,
    roles: ['ehf'],
  },
  {
    title: 'Vaccine Allocation',
    path: '/conveyor',
    icon: <MenuBookIcon />,
    roles: ['conveyor', 'ehf', 'uhf'],

  },
  {
    title: 'Vaccine Allocation',
    path: '/community-setup',
    icon: icon('ic-community'),
    roles: ['ehf', 'uhf','conveyor'],
  },
  // {
  //   title: 'Table Page',
  //   path: '/table',
  //   icon: icon('ic-lock'),
  //   roles: ['ehf','uhf','lcs','slwg','threepl'],
  // },
  {
    title: 'Report',
    path: '/report',
    icon: <StackedLineChartIcon />,
    roles: ['ehf','uhf','lcs','slwg','threepl', 'admin'],
  },
  //test-page
  {
    title: 'Test-Page',
    path: '/test-page',
    icon: icon('ic-blog'),
    roles: ['ehf','uhf','lcs','slwg','threepl', 'admin'],
  },
];
