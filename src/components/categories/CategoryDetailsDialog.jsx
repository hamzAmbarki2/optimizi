import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  CardMedia,
  CircularProgress,
} from '@mui/material';
import { CategoryModel } from '../../services/models';

const CategoryDetailsDialog = ({ open, onClose, category }) => {
  const [productsCount, setProductsCount] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && category) {
      setLoading(true);
      CategoryModel.getProductsCount(category.id)
        .then(count => setProductsCount(count))
        .finally(() => setLoading(false));
    }
  }, [open, category]);

  if (!category) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Détails de la catégorie
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <CardMedia
              component="img"
              image={category.image || category.imgSrc || '/placeholder-image.jpg'}
              alt={category.name || category.title}
              sx={{
                width: '100%',
                height: 160,
                objectFit: 'cover',
                borderRadius: 2,
                mb: 2,
              }}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {category.name || category.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {category.description || category.subtitle}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
              <Chip
                label={
                  loading
                    ? <CircularProgress size={16} />
                    : `${productsCount ?? 0} produit${productsCount === 1 ? '' : 's'}`
                }
                color="primary"
                size="small"
              />
              {category.featured && (
                <Chip label="En vedette" color="secondary" size="small" />
              )}
              {category.active === false && (
                <Chip label="Inactif" color="default" size="small" />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              Créé le : {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDetailsDialog;
