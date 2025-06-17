import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const FournisseurCard = ({ Fournisseur, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    if (onEdit) onEdit(Fournisseur);
  };

  const handleDelete = () => {
    handleClose();
    if (onDelete) {
      console.log('Delete Fournisseur triggered:', Fournisseur.id); // Already present
      onDelete(Fournisseur);
    }
  };

  return (
    <StyledCard>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={Fournisseur.image || '/placeholder.jpg'}
          alt={Fournisseur.name}
          sx={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            display: 'flex',
            gap: 1,
          }}
        >
          <IconButton
            aria-label="settings"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
            }}
            onClick={handleMenuClick}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            id={`menu-${Fournisseur.id}`}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'Fournisseur-menu-button',
            }}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              Edit
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              Delete
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {Fournisseur.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Matricule Fiscale: {Fournisseur.matriculeFiscale}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Address:
          </Typography>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {Fournisseur.address}
            </Typography>
            {Fournisseur.useUserAddress && (
              <Chip
                icon={<SyncIcon fontSize="small" />}
                label="Synced with your profile"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mt: 1, fontSize: '0.7rem' }}
              />
            )}
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Opening Hours: {Fournisseur.openingHours}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default FournisseurCard;

