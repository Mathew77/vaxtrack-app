//import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  // {
  //   title: 'Dashboard',
  //   path: '/home',
  //   icon: icon('ic-analytics'),
  //   roles: ['admin', 'ehf', 'uhf', 'lcco', 'slwg', 'threepl'],
  // },
//EHF Menu
  {
    title: 'Dashboard',
    path: '/ehf-home',
    icon: icon('ic-user'),
    roles: ['ehf'],
    children: [
      { title: 'EHF Dashboard 1', path: '/ehf-home/dashboard1', roles: ['ehf', 'admin'] },
      { title: 'EHF Dashboard 2', path: '/ehf-home/dashboard2', roles: ['ehf', 'admin'] },
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
  
  //LCCO Menu
  {
    title: 'Dashboard',
    path: '/lcco-home',
    icon: icon('ic-analytics'),
    roles: ['lcco'],
    children: [
      { title: 'LCCO Dashboard 1', path: '/lcco-home/dashboard1', roles: ['lcco', 'admin'] },
      { title: 'LCCO Dashboard 2', path: '/lcco-home/dashboard2', roles: ['lcco', 'admin'] },
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
 
  //Adminsitratve  Menu
  {
    title: 'Dashboard',
    path: '/admin-home',
    icon: icon('ic-analytics'),
    roles: ['admin'],
  },
  
  {
    title: 'EHF & UHF Setup',
    path: '/ehf-setup',
    icon: icon('ic-user'),
    roles: ['admin'],
  },
  {
    title: 'LCCO & SLWG SETUP',
    path: '/lcco-setup',
    icon: icon('ic-user'),
    roles: ['admin'],
  },
  {
    title: '3PL & SCS SETUP',
    path: '/threepl-setup',
    icon: icon('ic-user'),
    roles: ['admin'],
  },
  {
    title: 'Roles & Permissions',
    path: '/role-setup',
    icon: icon('ic-user'),
    roles: ['admin'],
  },
  {
    title: 'User Management',
    path: '/user-management',
    icon: icon('ic-user'),
    roles: ['admin'],
  },
  {
    title: 'Organisation Unit',
    path: '/org-unit',
    icon: icon('ic-user'),
    roles: ['admin'],
  },
  //Generic Menu 
  {
    title: 'Vaccine Request Form',
    path: '/vaccines',
    icon: icon('ic-lock'),
    roles: ['ehf','uhf','lcco','slwg','threepl'],
  },
  {
    title: 'Table Page',
    path: '/table',
    icon: icon('ic-lock'),
    roles: ['ehf','uhf','lcco','slwg','threepl'],
  },
  {
    title: 'Report',
    path: '/report',
    icon: icon('ic-blog'),
    roles: ['ehf','uhf','lcco','slwg','threepl'],
  },
];
