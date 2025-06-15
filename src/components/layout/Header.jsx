import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  InputBase,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Email as EmailIcon,
  Inventory as InventoryIcon,
  RateReview as RateReviewIcon,
  SystemUpdate as SystemUpdateIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';


const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, drawerwidth }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1],
  borderBottom: `1px solid ${theme.palette.divider}`,
  ...(open && {
    marginLeft: drawerwidth,
    width: `calc(100% - ${drawerwidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '24ch',
    },
  },
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 5,
    top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
  },
}));

const Header = ({ open, handleDrawerToggle, drawerWidth }) => {
  const { logout, currentUser } = useAuth();

  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  const handleProfileClick = () => {
    handleCloseUserMenu();
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    handleCloseUserMenu();
    navigate('/settings');
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    try {
      await logout();
      navigate('/signin');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };


  return (
      <AppBarStyled position="fixed" open={open} drawerwidth={drawerWidth}>
        <Toolbar sx={{ minHeight: '64px !important' }}>
          <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{
                mr: 2,
                color: theme.palette.text.primary,
                ...(open && { display: 'none' }),
              }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
          >
            E-Commerce Dashboard
          </Typography>

          <SearchWrapper>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
            />
          </SearchWrapper>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Help Center">
              <IconButton
                  color="inherit"
                  sx={{
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }
                  }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton
                  color="inherit"
                  onClick={handleOpenNotificationsMenu}
                  sx={{
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }
                  }}
              >
                <NotificationBadge badgeContent={4} color="error">
                  <NotificationsIcon />
                </NotificationBadge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton
                  color="inherit"
                  onClick={handleSettingsClick}
                  sx={{
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }
                  }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, ml: 1 }}
              >
                <Avatar
                    alt={currentUser?.displayName || currentUser?.name || "User"}
                    src={currentUser?.imageUrl || ''}
                    sx={{
                      width: 36,
                      height: 36,
                      border: `2px solid ${theme.palette.primary.main}`
                    }}
                />
              </IconButton>
            </Tooltip>
          </Box>

          {/* User Menu */}
          <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                elevation: 3,
                sx: {
                  minWidth: 200,
                  borderRadius: 2,
                  overflow: 'visible',
                  mt: 1.5,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {currentUser?.displayName || currentUser?.name || "User"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser?.email || ""}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
              sx={{ mt: '45px' }}
              id="menu-notifications"
              anchorEl={anchorElNotifications}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNotifications)}
              onClose={handleCloseNotificationsMenu}
              PaperProps={{
                elevation: 3,
                sx: {
                  width: 360,
                  maxHeight: 440,
                  borderRadius: 2,
                  overflow: 'visible',
                  mt: 1.5,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>Notifications</Typography>
              <Typography variant="body2" color="text.secondary">You have 4 new notifications</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleCloseNotificationsMenu} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                  primary="New order received: #ORD-001"
                  secondary="2 minutes ago"
                  secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </MenuItem>
            <MenuItem onClick={handleCloseNotificationsMenu} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <InventoryIcon color="warning" />
              </ListItemIcon>
              <ListItemText
                  primary="Product 'Wireless Earbuds' is low in stock"
                  secondary="1 hour ago"
                  secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </MenuItem>
            <MenuItem onClick={handleCloseNotificationsMenu} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <RateReviewIcon color="info" />
              </ListItemIcon>
              <ListItemText
                  primary="3 customer reviews need approval"
                  secondary="3 hours ago"
                  secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </MenuItem>
            <MenuItem onClick={handleCloseNotificationsMenu} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <SystemUpdateIcon color="success" />
              </ListItemIcon>
              <ListItemText
                  primary="System update available"
                  secondary="1 day ago"
                  secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </MenuItem>
            <Divider />
            <MenuItem sx={{ justifyContent: 'center', color: 'primary.main' }}>
              <Typography variant="body2" fontWeight={500}>View All Notifications</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBarStyled>
  );
};

export default Header;