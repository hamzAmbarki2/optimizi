import React from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Tooltip,
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  Restaurant as RestaurantIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  minHeight: '64px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const openedMixin = (theme, drawerWidth) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeIn,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(8)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open, drawerwidth }) => ({
      width: drawerwidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      '& .MuiDrawer-paper': {
        borderRight: 'none',
        backgroundColor: theme.palette.background.default,
        boxShadow: theme.shadows[1],
      },
      ...(open && {
        ...openedMixin(theme, drawerwidth),
        '& .MuiDrawer-paper': openedMixin(theme, drawerwidth),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
);

const Sidebar = ({ open, handleDrawerToggle, drawerWidth }) => {
  const theme = useTheme();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
    { text: 'Products', icon: <InventoryIcon />, path: '/products' },
    { text: 'Fournisseurs', icon: <RestaurantIcon />, path: '/Fournisseurs' },
    { text: 'Users', icon: <GroupIcon />, path: '/users' },
  ];

  const secondaryItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];


  return (
      <DrawerStyled variant="permanent" open={open} drawerwidth={drawerWidth}>
        <DrawerHeader>
          {open ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      mr: 2,
                      backgroundColor: theme.palette.secondary.main
                    }}
                >
                  R
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Fournisseur Admin
                </Typography>
              </Box>
          ) : null}
          <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)'
                }
              }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <Tooltip title={!open ? item.text : ''} placement="right" arrow>
                  <ListItemButton
                      component={Link}
                      to={item.path}
                      selected={location.pathname === item.path}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        mx: 1,
                        my: 0.5,
                        borderRadius: 1,
                        transition: 'all 0.2s ease',
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.action.selected,
                          color: theme.palette.primary.main,
                          '& .MuiListItemIcon-root': {
                            color: theme.palette.primary.main,
                          },
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                  >
                    <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                          color: location.pathname === item.path
                              ? theme.palette.primary.main
                              : theme.palette.text.secondary,
                        }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.text}
                        sx={{
                          opacity: open ? 1 : 0,
                          '& span': {
                            fontWeight: location.pathname === item.path ? 600 : 500,
                          }
                        }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
          ))}
        </List>

        <Divider />

        <List>
          {secondaryItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <Tooltip title={!open ? item.text : ''} placement="right" arrow>
                  <ListItemButton
                      component={Link}
                      to={item.path}
                      selected={location.pathname === item.path}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        mx: 1,
                        my: 0.5,
                        borderRadius: 1,
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.action.selected,
                          color: theme.palette.primary.main,
                          '& .MuiListItemIcon-root': {
                            color: theme.palette.primary.main,
                          },
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                  >
                    <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                          color: theme.palette.text.secondary,
                        }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.text}
                        sx={{
                          opacity: open ? 1 : 0,
                          '& span': {
                            fontWeight: location.pathname === item.path ? 600 : 500,
                          }
                        }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
          ))}
        </List>

        <Divider />

        
      </DrawerStyled>
  );
};

export default Sidebar;