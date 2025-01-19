    // src/pages/AddData.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Snackbar,
  Paper,
  Box,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

const AddData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    foodItem: "",
    quantityPrepared: "",
    quantityWasted: "",
    eventType: "Small Gathering",
    attendees: "",
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const validateForm = () => {
    const newErrors = {};
    if (!data.foodItem.trim()) {
      newErrors.foodItem = "Food item is required";
    }
    if (!data.quantityPrepared || data.quantityPrepared <= 0) {
      newErrors.quantityPrepared = "Please enter a valid quantity prepared";
    }
    if (!data.quantityWasted || data.quantityWasted < 0) {
      newErrors.quantityWasted = "Please enter a valid quantity wasted";
    }
    if (Number(data.quantityWasted) > Number(data.quantityPrepared)) {
      newErrors.quantityWasted = "Wasted quantity cannot be greater than prepared quantity";
    }
    if (!data.eventType) {
      newErrors.eventType = "Event type is required";
    }
    if (!data.attendees || data.attendees <= 0) {
      newErrors.attendees = "Please enter a valid number of attendees";
    }
    if (!data.date) {
      newErrors.date = "Date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleAddData = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Transform the data to match backend expectations exactly
      const transformedData = {
        foodPrepared: parseFloat(data.quantityPrepared),
        foodWasted: parseFloat(data.quantityWasted),
        eventType: data.eventType,
        attendees: parseInt(data.attendees),
        date: new Date(data.date).toISOString(),
        notes: data.foodItem
      };

      console.log('Sending data:', transformedData); // Add this for debugging

      const response = await axios.post(
        "http://localhost:5000/api/data",
        transformedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        setSnackbarMessage("Data added successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        // Clear form
        setData({
          foodItem: "",
          quantityPrepared: "",
          quantityWasted: "",
          eventType: "Small Gathering",
          attendees: "",
          date: new Date().toISOString().split('T')[0],
        });

        // Navigate to dashboard after short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Error adding data:", error);
      setSnackbarMessage(
        error.response?.data?.error || 
        error.response?.data?.message || 
        "Error adding data"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
              Add Food Waste Data
            </Typography>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/dashboard")}
              variant="outlined"
            >
              Back
            </Button>
          </Box>

          <Box component="form" onSubmit={handleAddData} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Food Item"
                  name="foodItem"
                  value={data.foodItem}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.foodItem}
                  helperText={errors.foodItem}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Quantity Prepared (kg)"
                  name="quantityPrepared"
                  type="number"
                  value={data.quantityPrepared}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.quantityPrepared}
                  helperText={errors.quantityPrepared}
                  required
                  inputProps={{ min: 0, step: "0.1" }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Quantity Wasted (kg)"
                  name="quantityWasted"
                  type="number"
                  value={data.quantityWasted}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.quantityWasted}
                  helperText={errors.quantityWasted}
                  required
                  inputProps={{ min: 0, step: "0.1" }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="Event Type"
                  name="eventType"
                  value={data.eventType}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.eventType}
                  helperText={errors.eventType}
                  required
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="Small Gathering">Small Gathering</option>
                  <option value="Birthday Party">Birthday Party</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Festival">Festival</option>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Number of Attendees"
                  name="attendees"
                  type="number"
                  value={data.attendees}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.attendees}
                  helperText={errors.attendees}
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Date"
                  name="date"
                  type="date"
                  value={data.date}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.date}
                  helperText={errors.date}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{ mt: 2 }}
                >
                  {loading ? "Saving..." : "Save Data"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddData;
