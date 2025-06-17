import React, { useEffect, useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';
import { CategoryModel } from '../../services/models';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    '& .media-overlay': {
      opacity: 0.3,
    }
  },
}));

const MediaContainer = styled(Box)({
  position: 'relative',
  height: 160,
  overflow: 'hidden',
});

const MediaOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
  opacity: 0.15,
  transition: 'opacity 0.3s ease',
}));

const CategoryCard = ({ category, onEdit, onDelete, onViewDetails }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [productsCount, setProductsCount] = useState(null);
  
  const open = Boolean(anchorEl);

  useEffect(() => {
    let mounted = true;
    CategoryModel.getProductsCount(category.id).then(count => {
      if (mounted) setProductsCount(count);
    });
    return () => { mounted = false; };
  }, [category.id]);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    onEdit?.(category);
  };

  const handleDeleteClick = () => {
    handleClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    onDelete?.(category);
  };

  const handleViewDetails = () => {
    setAnchorEl(null);
    if (onViewDetails) onViewDetails(category);
  };

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <>
      <StyledCard>
        <MediaContainer>
          {imgError ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
              bgcolor={theme.palette.grey[200]}
            >
              <Avatar sx={{ width: 60, height: 60, bgcolor: theme.palette.primary.main }}>
                <CategoryIcon fontSize="large" />
              </Avatar>
            </Box>
          ) : (
            <CardMedia
              component="img"
              height="160"
              image={category.image}
              alt={category.name}
              onError={handleImageError}
              sx={{ objectFit: 'cover' }}
            />
          )}
          <MediaOverlay className="media-overlay" />
          
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              gap: 1,
              zIndex: 2,
            }}
          >
            {category.featured && (
              <Chip
                label="Featured"
                size="small"
                color="primary"
                sx={{ 
                  fontWeight: 700,
                  boxShadow: theme.shadows[1],
                  backdropFilter: 'blur(4px)',
                  backgroundColor: 'rgba(255,255,255,0.8)',
                }}
              />
            )}
            <IconButton
              aria-label="settings"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.9)',
                boxShadow: theme.shadows[1],
                '&:hover': { 
                  backgroundColor: theme.palette.background.paper,
                  transform: 'rotate(90deg)'
                },
                transition: 'all 0.3s ease'
              }}
              onClick={handleMenuClick}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              id={`menu-${category.id}`}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ 'aria-labelledby': 'category-menu-button' }}
              PaperProps={{
                elevation: 4,
                sx: {
                  borderRadius: 3,
                  minWidth: 180,
                  '& .MuiMenuItem-root': {
                    padding: '8px 16px',
                  }
                }
              }}
            >
              <MenuItem onClick={handleViewDetails}>
                <ListItemIcon>
                  <VisibilityIcon fontSize="small" />
                </ListItemIcon>
                Voir détails
              </MenuItem>
              <MenuItem onClick={handleEdit}>
                <ListItemIcon>
                  <EditIcon fontSize="small" color="primary" />
                </ListItemIcon>
                Modifier
              </MenuItem>
              <MenuItem onClick={handleDeleteClick}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                Supprimer
              </MenuItem>
            </Menu>
          </Box>
        </MediaContainer>
        
        <CardContent sx={{ flexGrow: 1, px: 2.5, pt: 2.5, pb: 2 }}>
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              minHeight: '2.5em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {category.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1.5,
              minHeight: '3.6em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {category.description}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Chip
              label={
                productsCount === null
                  ? '...'
                  : `${productsCount} produit${productsCount !== 1 ? 's' : ''}`
              }
              size="small"
              color="primary"
              variant="outlined"
            />
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              Ajouté le : {category.createdAt ? formatDate(category.createdAt) : ''}
            </Typography>
          </Box>
        </CardContent>
        
      </StyledCard>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer la catégorie <strong>"{category.name}"</strong> ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
            sx={{ borderRadius: 2, boxShadow: 'none' }}
            autoFocus
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoryCard;