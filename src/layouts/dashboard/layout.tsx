import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { _langs, _notifications } from 'src/_mock';

import { Iconify } from 'src/components/iconify';

import { Main } from './main';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav';
import { navData } from '../config-nav-dashboard';
import { Searchbar } from '../components/searchbar';
import { _workspaces } from '../config-nav-workspace';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { AccountPopover } from '../components/account-popover';
import { LanguagePopover } from '../components/language-popover';
import { NotificationsPopover } from '../components/notifications-popover';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const theme = useTheme();

  const [navOpen, setNavOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  const layoutQuery: Breakpoint = 'lg';

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    
    if (storedUsername) {
      setUserName(storedUsername);
      
      if (storedUsername.includes('admin')) {
        setUserRole('admin');
      } else if (storedUsername.includes('ehf')) {
        setUserRole('ehf');
      } else if (storedUsername.includes('uhf')) {
        setUserRole('uhf');
      } else if (storedUsername.includes('lcs')) {
        setUserRole('lcs');
      } else if (storedUsername.includes('scs')) {
        setUserRole('scs');
      } else if (storedUsername.includes('slwg')) {
        setUserRole('slwg');
      } else if (storedUsername.includes('threepl')) {
        setUserRole('threepl');
      } else if (storedUsername.includes('conveyor')){
        setUserRole('conveyor');
      } else {
        setUserRole('guest');
      }
    }
  }, []);

  const filteredNavData = navData.filter(item => 
    item.roles && item.roles.includes(userRole)
  );


  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: { px: { [layoutQuery]: 5 } },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                <MenuButton
                  onClick={() => setNavOpen(true)}
                  sx={{
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  data={filteredNavData}
                  open={navOpen}
                  onClose={() => setNavOpen(false)}
                  // workspaces={_workspaces}
                />
              <p ></p>
              <Typography variant="h4" >
                 Welcome : Abuja General Hospital - {userRole.toUpperCase()}
              </Typography>
              </>
            ),
            rightArea: (
              <Box gap={1} display="flex" alignItems="center">
                
                <Searchbar />
                {/* <LanguagePopover data={_langs} /> */}
                <NotificationsPopover data={_notifications} />
                <AccountPopover
                  data={[
                    {
                      label: 'Home',
                      href: 'home',
                      icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
                    },
                    {
                      label: 'Profile',
                      href: '#',
                      icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
                    },
                    {
                      label: 'Settings',
                      href: '#',
                      icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
                    },
                  ]}
                />
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        <NavDesktop data={filteredNavData} layoutQuery={layoutQuery} /> 
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        '--layout-nav-vertical-width': '300px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      {/* <p>Breadcrum</p> */}
      <Main>{children}</Main>
    </LayoutSection>
  );
}
