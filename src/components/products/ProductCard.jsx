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
  Badge,
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
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  fontWeight: 'bold',
  fontSize: '0.75rem',
  padding: theme.spacing(0.5),
  borderRadius: '4px',
  zIndex: 1,
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

  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) 
    : 0;

  const hasDiscount = discountPercentage > 0;
  const isLowStock = product.stockQuantity < 10;

  return (
    <StyledCard onClick={handleView} sx={{ cursor: 'pointer' }}>
      <Box sx={{ position: 'relative', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
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
        
        {/* Discount Badge */}
        {hasDiscount && (
          <DiscountBadge 
            label={`${discountPercentage}% OFF`} 
            size="small" 
            icon={<LocalOfferIcon fontSize="inherit" />}
          />
        )}
        
        {/* Availability Badge */}
        <StatusBadge
          label={product.isAvailable ? "Available" : "Out of Stock"}
          size="small"
          color={product.isAvailable ? "success" : "error"}
          icon={product.isAvailable ? 
            <CheckCircleIcon fontSize="inherit" /> : 
            <CancelIcon fontSize="inherit" />}
        />
        
        {/* Action Menu */}
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
      
      <CardContent sx={{ flexGrow: 1, p: isMobile ? 1.5 : 2 }}>
        {/* Category */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <CategoryIcon fontSize="small" color="action" />
          <Chip 
            label={categories?.find(c => c.id === product.categoryId)?.title || 'Uncategorized'} 
            size="small" 
            variant="outlined"
          />
        </Stack>
        
        {/* Title */}
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
        
        {/* Price */}
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          alignItems={isMobile ? 'flex-start' : 'center'} 
          spacing={1}
          sx={{ mb: 1.5 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
              {formatCurrency(product.price)}
            </Typography>
            
            {product.comparePrice > 0 && (
              <Typography variant="body2" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
                {formatCurrency(product.comparePrice)}
              </Typography>
            )}
          </Stack>
        </Stack>
        
        {/* Stock & Unit */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <InventoryIcon fontSize="small" color={isLowStock ? "error" : "action"} />
            <Typography 
              variant="caption" 
              color={isLowStock ? "error" : "text.secondary"}
              sx={{ fontWeight: isLowStock ? 700 : 500 }}
            >
              Stock: {product.stockQuantity} {isLowStock && '• Low'}
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
      </CardContent>
      
      {/* Action Menu */}
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
          <Typography variant="body2">View Details</Typography>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Edit</Typography>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Delete</Typography>
        </MenuItem>
      </Menu>
    </StyledCard>
  );
};

export default ProductCard;