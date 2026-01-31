import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useEffect, useState, useMemo } from 'react';


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
import { useFetchScs } from 'src/hooks/apis/lcs-scs/scs-hooks';


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
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [userState, setUserState] = useState('');


  const layoutQuery: Breakpoint = 'lg';

  // Fetch all SCS to resolve ID to name
  const { data: allScs } = useFetchScs();


  const parseAndExtractState = useMemo(() => (listKey: string): string => {
    try {
      const listData = sessionStorage.getItem(listKey);
      if (listData) {
        let parsed = JSON.parse(listData);
        if (typeof parsed === 'string') {
          parsed = JSON.parse(parsed);
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          // For lists like scs_list, slwg_list where items are objects with a 'state' property
          if (typeof parsed[0] === 'object' && parsed[0] !== null && 'state' in parsed[0]) {
            return parsed[0].state;
          }
          // For lists like ehf_list where items are strings (e.g., "NY-123" or just "21")
          if (typeof parsed[0] === 'string') {
            const val = parsed[0];
            if (val.includes('-')) {
              return val.split('-')[0];
            }

            // Resolve numeric ID to state name
            if (!isNaN(Number(val)) && allScs) {
              const scsRecord = allScs.find(s => s.id?.toString() === val);
              if (scsRecord && scsRecord.stat_id) {
                return scsRecord.stat_id;
              }
            }
            return val;
          }
        }
      }
    } catch (error) {
      console.error(`Error parsing ${listKey}:`, error);
    }
    return '';
  }, [allScs]);


  useEffect(() => {
    const storedRole = sessionStorage.getItem('userRole');
    const storedUsername = sessionStorage.getItem('username');
    const storedFirstName = sessionStorage.getItem('firstName');


    if (storedRole) {
      setUserRole(storedRole);


      let stateName = '';


      if (storedRole === 'slwg') {
        stateName = parseAndExtractState('slwg_list') || parseAndExtractState('scs_list');
      } else if (storedRole === 'scs') {
        stateName = parseAndExtractState('scs_list');
      } else if (storedRole === 'mcco') {
        stateName = parseAndExtractState('ehf_list');
      }


      setUserState(stateName);
    }
    if (storedUsername) {
      setUserName(storedUsername);
    }
    if (storedFirstName) {
      setFirstName(storedFirstName);
    }
  }, [parseAndExtractState]);


  // Filter navData based on the userRole
  const filteredNavData = navData.filter((item) =>
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
                />


                <Typography variant="h4" >
                  Welcome :  {`${(firstName || userName).toUpperCase()} (${userRole === 'threepl' ? '3PL' : userRole.toUpperCase()}${userState ? `: ${userState}` : ''})`}
                </Typography>
              </>
            ),
            rightArea: (
              <Box gap={1} display="flex" alignItems="center">
                <AccountPopover
                  data={[
                    {
                      label: 'Profile',
                      href: '#',
                      icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
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
        <NavDesktop
          data={filteredNavData}
          layoutQuery={layoutQuery}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        '--layout-nav-vertical-width': collapsed ? '80px' : '300px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
            transition: 'padding-left 0.3s ease-in-out',
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
