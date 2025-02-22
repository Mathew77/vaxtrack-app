//import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/home',
    icon: icon('ic-analytics'),
    roles: ['admin', 'ehf', 'uhf', 'lcco', 'slwg', 'threepl'],
  },
  {
    title: 'Vaccine Request Form',
    path: '/vaccines',
    icon: icon('ic-user'),
    roles: ['admin'],
  },
  {
    title: 'EHF Dashboard',
    path: '/ehf-home',
    icon: icon('ic-user'),
    roles: ['ehf', 'admin'],
    children: [
      { title: 'EHF Dashboard 1', path: '/ehf-home/dashboard1', roles: ['ehf', 'admin'] },
      { title: 'EHF Dashboard 2', path: '/ehf-home/dashboard2', roles: ['ehf', 'admin'] },
    ],
  },
  {
    title: 'UHF Dashboard',
    path: '/uhf-home',
    icon: icon('ic-user'),
    roles: ['uhf', 'admin'],
    children: [
      { title: 'UHF Dashboard 1', path: '/uhf-home/dashboard1', roles: ['uhf', 'admin'] },
      { title: 'UHF Dashboard 2', path: '/uhf-home/dashboard2', roles: ['uhf', 'admin'] },
    ],
  },
  {
    title: 'LCCO Dashboard',
    path: '/lcco-home',
    icon: icon('ic-user'),
    roles: ['lcco', 'admin'],
    children: [
      { title: 'LCCO Dashboard 1', path: '/lcco-home/dashboard1', roles: ['lcco', 'admin'] },
      { title: 'LCCO Dashboard 2', path: '/lcco-home/dashboard2', roles: ['lcco', 'admin'] },
    ],
  },
  {
    title: 'SLWG Dashboard',
    path: '/slwg-home',
    icon: icon('ic-user'),
    roles: ['slwg', 'admin'],
    children: [
      { title: 'SLWG Dashboard 1', path: '/slwg-home/dashboard1', roles: ['slwg', 'admin'] },
      { title: 'SLWG Dashboard 2', path: '/slwg-home/dashboard2', roles: ['slwg', 'admin'] },
    ],
  },
  {
    title: '3PL & SCS Dashboard',
    path: '/threepl-home',
    icon: icon('ic-user'),
    roles: ['threepl', 'admin'],
    children: [
      { title: '3PL Dashboard 1', path: '/threepl-home/dashboard1', roles: ['threepl', 'admin'] },
      { title: '3PL Dashboard 2', path: '/threepl-home/dashboard2', roles: ['threepl', 'admin'] },
    ],
  },
  {
    title: 'Administrative Dashboard',
    path: '/admin-home',
    icon: icon('ic-user'),
    roles: ['admin'],
  },
];
