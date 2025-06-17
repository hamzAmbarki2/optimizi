import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocalOffer as LocalOfferIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/helpers';
import { format } from 'date-fns';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  borderRadius: '12px',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const DiscountBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  left: 12,
  backgroundColor: theme.palette.error.main, // Changed to red
  color: theme.palette.error.contrastText,
  fontWeight: 'bold',
  fontSize: '0.75rem',
  padding: theme.spacing(0.5),
  borderRadius: '50%', // Changed to circular
  zIndex: 2,
  minWidth: 36, // Ensure circular shape
  height: 36, // Ensure circular shape
  justifyContent: 'center', // Center content
}));

const StatusBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 1,
}));

const ProductCard = ({ product, onEdit, onDelete, onView, categories }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    handleClose();
    if (onEdit) onEdit(product);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    handleClose();
    if (onDelete) onDelete(product);
  };

  const handleView = (e) => {
    e.stopPropagation();
    handleClose();
    if (onView) onView(product);
  };

  const discountPercentage = product.comparePrice && product.comparePrice > 0
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const hasDiscount = discountPercentage > 0;
  const isLowStock = product.stockQuantity < 10;

  return (
    <StyledCard onClick={() => onView && onView(product)} sx={{ cursor: 'pointer', position: 'relative' }}>
      <Box sx={{ position: 'relative', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
        {/* Badge de réduction circulaire */}
        {hasDiscount && (
          <DiscountBadge 
            label={`-${discountPercentage}%`} 
            size="small"
          />
        )}
        <CardMedia
          component="img"
          height={isMobile ? 160 : 200}
          image={product.imageURL || '/placeholder-image.jpg'}
          alt={product.title}
          sx={{ 
            objectFit: 'cover',
            aspectRatio: '16/10',
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        {/* Badge de disponibilité */}
        <StatusBadge
          label={product.isAvailable ? "Disponible" : "Rupture"}
          size="small"
          color={product.isAvailable ? "success" : "error"}
          icon={product.isAvailable ? 
            <CheckCircleIcon fontSize="inherit" /> : 
            <CancelIcon fontSize="inherit" />}
        />
        {/* Menu d'actions */}
        <IconButton
          aria-label="settings"
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s',
            zIndex: 1,
          }}
          onClick={handleMenuClick}
        >
          <MoreVertIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: isMobile ? 1.5 : 2, position: 'relative', pb: 6 }}>
        {/* Catégorie */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <CategoryIcon fontSize="small" color="action" />
          <Chip 
            label={categories?.find(c => c.id === product.categoryId)?.title || 'Non catégorisé'} 
            size="small" 
            variant="outlined"
          />
        </Stack>
        
        {/* Titre */}
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          component="h3" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            minHeight: isMobile ? '24px' : '28px',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.title}
        </Typography>
        
        {/* Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            minHeight: '40px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.description}
        </Typography>
        
        {/* Prix */}
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          alignItems={isMobile ? 'flex-start' : 'center'} 
          spacing={1}
          sx={{ mb: 1.5 }}
        >
          <Stack direction="column" alignItems="flex-start" spacing={0.5}>
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>
              HTVA : {Number(product.prixHTVA).toFixed(3)} DT
            </Typography>
            <Typography variant="body2" color="text.secondary">
              TVA : {product.tva} %
            </Typography>
            <Typography variant="h6" color="success.main" sx={{ fontWeight: 800 }}>
              TTC : {Number(product.prixTTC).toFixed(3)} DT
            </Typography>
          </Stack>
        </Stack>
        
        {/* Stock et unité */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <InventoryIcon fontSize="small" color={isLowStock ? "error" : "action"} />
            <Typography 
              variant="caption" 
              color={isLowStock ? "error" : "text.secondary"}
              sx={{ fontWeight: isLowStock ? 700 : 500 }}
            >
              Stock : {product.stockQuantity} {isLowStock && '• Faible'}
            </Typography>
          </Stack>
          
          <Chip 
            label={product.unit} 
            size="small" 
            variant="outlined"
            sx={{ borderRadius: '4px' }}
          />
        </Stack>
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {product.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  borderRadius: '4px',
                  backgroundColor: theme.palette.grey[100],
                  color: theme.palette.text.secondary,
                }}
              />
            ))}
          </Box>
        )}
        
        {/* Review (always show, even if empty) */}
        <Box sx={{ mt: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
            Avis des clients :
          </Typography>
          {product.review && product.review.length > 0 ? (
            <Stack direction="column" spacing={0.5}>
              {product.review.slice(0, 2).map((r, idx) => (
                <Typography key={idx} variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  {typeof r === 'string' ? r : r?.comment || JSON.stringify(r)}
                </Typography>
              ))}
              {product.review.length > 2 && (
                <Typography variant="caption" color="primary.main">
                  ...et {product.review.length - 2} autres avis
                </Typography>
              )}
            </Stack>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Aucun avis pour ce produit.
            </Typography>
          )}
        </Box>
        
        {/* Date de création en bas à droite */}
        <Box
          sx={{
            position: 'absolute',
            right: 16,
            bottom: 8,
            color: 'text.secondary',
            fontSize: '0.75rem',
            opacity: 0.7,
          }}
        >
          {product.createdAt && (
            <>
              Ajouté le : {format(new Date(product.createdAt), 'yyyy-MM-dd')}
            </>
          )}
        </Box>
      </CardContent>
      
      {/* Menu d'actions */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Voir détails</Typography>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Modifier</Typography>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Supprimer</Typography>
        </MenuItem>
      </Menu>
    </StyledCard>
  );
};

export default ProductCard;