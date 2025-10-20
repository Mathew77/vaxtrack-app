import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect } from 'react';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { Typography, IconButton, Tooltip } from '@mui/material';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';

// import { NavUpgrade } from '../components/nav-upgrade';
// import { WorkspacesPopover } from '../components/workspaces-popover';

// import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  // workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  // workspaces,
  layoutQuery,
  collapsed,
  onToggleCollapse,
}: NavContentProps & { layoutQuery: Breakpoint; collapsed?: boolean; onToggleCollapse?: () => void }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: collapsed ? 1 : 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        transition: 'all 0.3s ease-in-out',
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  // workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots}  />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, sx, collapsed, onToggleCollapse }: NavContentProps & { collapsed?: boolean; onToggleCollapse?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* <Logo /> */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        {!collapsed && (
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{
              letterSpacing: 1.0,
              color: '#ffffff',
              textTransform: 'uppercase',
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            VAXTRACK
          </Typography>
        )}
        <IconButton
          onClick={onToggleCollapse}
          sx={{
            color: '#ffffff',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease-in-out',
            ml: collapsed ? 'auto' : 0,
            mr: collapsed ? 'auto' : 0,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Iconify
            icon={collapsed ? 'material-symbols:double-arrow-rounded' : 'material-symbols:keyboard-double-arrow-left-rounded'}
            width={24}
          />
        </IconButton>
      </Box>

      {slots?.topArea}

      {/* <WorkspacesPopover data={workspaces} sx={{ my: 2 }} /> */}

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={{ my: 3}}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item) => {
              const isActived = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <Tooltip title={collapsed ? item.title : ''} placement="right" arrow>
                    <ListItemButton
                      disableGutters
                      component={RouterLink}
                      href={item.path}
                      sx={{
                        pl: collapsed ? 1.5 : 2,
                        py: 1,
                        gap: 2,
                        pr: collapsed ? 1.5 : 1.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                        fontWeight: 'fontWeightMedium',
                        color: 'white',
                        minHeight: 'var(--layout-nav-item-height)',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        ...(isActived && {
                          fontWeight: 'fontWeightSemiBold',
                          bgcolor: 'var(--layout-nav-item-active-bg)',
                          color: 'var(--layout-nav-item-active-color)',
                          '&:hover': {
                            bgcolor: 'var(--layout-nav-item-hover-bg)',
                          },
                        }),
                      }}
                    >
                      <Box component="span" sx={{ width: 24, height: 24 }}>
                        {item.icon}
                      </Box>

                      {!collapsed && (
                        <>
                          <Box component="span" flexGrow={1}>
                            {item.title}
                          </Box>
                          {item.info && item.info}
                        </>
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}

      {/* <NavUpgrade /> */}
    </>
  );
}
