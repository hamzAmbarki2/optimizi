import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Home as HomeIcon,
  Lock as LockIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const UserCard = ({ user, onEdit, onDelete }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleEditClick = () => { handleClose(); onEdit(user); };
  const handleDeleteClick = () => { handleClose(); onDelete(user.id); };

  // Status color mapping
  const statusColors = {
    active: theme.palette.success.main,
    inactive: theme.palette.error.main,
    pending: theme.palette.warning.main,
    verified: theme.palette.info.main
  };

  return (
    <Card sx={{ 
      maxWidth: 450, 
      minWidth: 300, 
      borderRadius: 3, 
      boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={user.imageUrl} 
              sx={{ 
                width: 56, 
                height: 56, 
                mr: 2,
                border: `2px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.primary.light
              }}
            >
              {user.fullName.charAt(0)}
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                fontWeight="600"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {user.fullName}
                <Chip 
                  label={user.status} 
                  size="small"
                  sx={{ 
                    backgroundColor: statusColors[user.status.toLowerCase()] || theme.palette.grey[300],
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 20
                  }} 
                />
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  display: 'block',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: 200
                }}
              >
                {user.email}
              </Typography>

            </Box>
          </Box>
          <IconButton 
            onClick={handleMenuClick}
            sx={{ 
              alignSelf: 'flex-start',
              color: theme.palette.grey[600]
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Details Section */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
          gap: 2 
        }}>
          <DetailItem 
            icon={<PhoneIcon fontSize="small" />} 
            label="Phone" 
            value={user.phone} 
          />
          <DetailItem 
            icon={<BadgeIcon fontSize="small" />} 
            label="CIN" 
            value={user.cin} 
          />
    
          <DetailItem 
            icon={<LockIcon fontSize="small" />} 
            label="Password" 
            value="••••••••" 
            hidden 
          />
        </Box>
      </CardContent>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            minWidth: 180,
            '& .MuiMenuItem-root': {
              py: 1.5,
              px: 2
            }
          }
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Edit User</Typography>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: theme.palette.error.main }}>
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Delete User</Typography>
        </MenuItem>
      </Menu>
    </Card>
  );
};

// DetailItem sub-component for consistent styling
const DetailItem = ({ icon, label, value, hidden = false }) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: '50%',
      bgcolor: 'action.hover',
      mr: 1.5,
      flexShrink: 0
    }}>
      {icon}
    </Box>
    <Box>
      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{ 
          display: 'block', 
          lineHeight: 1.2,
          fontWeight: 500 
        }}
      >
        {label}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 500,
          ...(hidden && { 
            letterSpacing: 2,
            filter: 'blur(4px)',
            transition: 'filter 0.3s',
            '&:hover': { filter: 'none' }
          })
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

export default UserCard;