import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const EditDataModal = ({ open, handleClose, data, handleUpdate }) => {
  // Initialize form data when modal opens or data changes
  const [formData, setFormData] = useState({
    notes: '',
    foodPrepared: '',
    foodWasted: '',
    date: ''
  });

  // Update form data when modal opens with new data
  useEffect(() => {
    if (data) {
      setFormData({
        notes: data.notes || '',
        foodPrepared: data.foodPrepared || '',
        foodWasted: data.foodWasted || '',
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : ''
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only include fields that have been changed
    const changedFields = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] !== data[key]) {
        changedFields[key] = formData[key];
      }
    });
    handleUpdate(data._id, changedFields);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-data-modal"
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={3}>
          Edit Entry
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Food Item"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Quantity Prepared (kg)"
              name="foodPrepared"
              type="number"
              value={formData.foodPrepared}
              onChange={handleChange}
              inputProps={{ step: "0.01", min: "0" }}
            />
            <TextField
              fullWidth
              label="Quantity Wasted (kg)"
              name="foodWasted"
              type="number"
              value={formData.foodWasted}
              onChange={handleChange}
              inputProps={{ step: "0.01", min: "0" }}
            />
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Save Changes
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default EditDataModal; 