import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

const DeleteConfirmationModal = ({ open, handleClose, handleConfirmDelete }) => {
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: '320px'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="warning" />
          <Typography variant="h6" component="span">
            Confirm Delete
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          Are you sure you want to delete this entry? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{ 
            minWidth: '100px',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 'bold',
              borderColor: 'primary.main'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirmDelete}
          startIcon={<DeleteIcon />}
          sx={{ 
            minWidth: '100px',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'error.dark',
              fontWeight: 'bold'
            }
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal; 