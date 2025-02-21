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
  },
  
  // {
  //   title: 'Product',
  //   path: '/products',
  //   icon: icon('ic-cart'),
  //   info: (
  //     <Label color="error" variant="inverted">
  //       +3
  //     </Label>
  //   ),
  // },

  {
    title: 'Sign in',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },

  {
    title: 'EHF Dashboard',
    path: '/ehf-home',
    icon: icon('ic-user'),
  },
  {
    title: 'UHF Dashboard',
    path: '/uhf-home',
    icon: icon('ic-user'),
  },
  {
    title: 'LCCO Dashboard',
    path: '/lcco-home',
    icon: icon('ic-user'),
  },
  {
    title: 'SLWG Dashboard',
    path: '/slwg-home',
    icon: icon('ic-user'),
  },
  {
    title: '3PL & SCS Dashboard',
    path: '/threepl-home',
    icon: icon('ic-user'),
  },
  {
    title: 'Administrative Dashboard',
    path: '/admin-home',
    icon: icon('ic-user'),
  },
];
