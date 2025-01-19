// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Alert,
  TableContainer,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Avatar,
  Divider,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import StatisticsCards from '../components/StatisticsCards';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [predictionDate, setPredictionDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventType, setEventType] = useState('Small Gathering');
  const [attendees, setAttendees] = useState(50);
  const [prediction, setPrediction] = useState(null);
  const [mlData, setMlData] = useState([]);
  const [isMLDataLoading, setIsMLDataLoading] = useState(true);
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState({
    date: '',
    event_type: '',
    attendees: ''
  });
  const [isPredicting, setIsPredicting] = useState(false);

  const eventTypes = [
    'Wedding',
    'Corporate Event',
    'Birthday Party',
    'Festival',
    'Small Gathering'
  ];

  const handlePredictionInput = (e) => {
    setPredictionData({
      ...predictionData,
      [e.target.name]: e.target.value
    });
  };

  const handlePredict = async () => {
    try {
      setIsPredicting(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        "http://localhost:5000/api/ml-data/predict",
        predictionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPrediction(response.data.prediction);
      setSnackbarMessage("Prediction successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Prediction error:", error);
      setSnackbarMessage(error.response?.data?.message || "Error making prediction");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data) {
        const sortedData = response.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setData(sortedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSnackbarMessage(error.response?.data?.message || "Error fetching data");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMLData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/ml-data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data) {
        setMlData(response.data);
      }
    } catch (error) {
      console.error("Error fetching ML data:", error);
      setSnackbarMessage("Error fetching historical data");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsMLDataLoading(false);
    }
  };

  // Reset prediction form data
  const resetPredictionForm = () => {
    setPredictionData({
      date: '',
      event_type: '',
      attendees: ''
    });
    setPrediction(null); // Clear any previous prediction result
  };

  const refreshAllData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      await Promise.all([
        fetchUserDetails(),
        fetchData(),
        fetchMLData()
      ]);
      
      // Reset prediction form
      resetPredictionForm();
      
      setSnackbarMessage("Data refreshed successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setSnackbarMessage("Error refreshing data");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchData();
    fetchMLData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setSnackbarMessage("Logged out successfully");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const calculateWastePercentage = (prepared, wasted) => {
    if (!prepared || !wasted) return "0.0";
    return ((wasted / prepared) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(to right, #f3f4f6, #ffffff)'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar 
            sx={{ 
              width: 56, 
              height: 56, 
              bgcolor: 'primary.main',
              boxShadow: 2
            }}
          >
            {user?.name ? user.name[0].toUpperCase() : <PersonIcon />}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              Welcome, {user?.name || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            Food Waste Dashboard
          </Typography>
          <Tooltip title="Refresh all data">
            <IconButton 
              onClick={refreshAllData} 
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <RefreshIcon />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/add-data")}
            sx={{ borderRadius: 2 }}
          >
            Add New Entry
          </Button>
          <Tooltip title="Logout">
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ borderRadius: 2 }}
            >
              Logout
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <StatisticsCards data={data} />

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Predict Food Preparation
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              name="date"
              label="Event Date"
              value={predictionData.date}
              onChange={handlePredictionInput}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              name="event_type"
              label="Event Type"
              value={predictionData.event_type}
              onChange={handlePredictionInput}
            >
              {eventTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              name="attendees"
              label="Number of Attendees"
              value={predictionData.attendees}
              onChange={handlePredictionInput}
              inputProps={{ min: 1 }}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={handlePredict}
          disabled={isPredicting || !predictionData.date || !predictionData.event_type || !predictionData.attendees}
          sx={{ mb: 3 }}
        >
          {isPredicting ? <CircularProgress size={24} color="inherit" /> : "Predict"}
        </Button>

        {prediction !== null && (
          <Paper elevation={2} sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="h6" gutterBottom>
              Prediction Result
            </Typography>
            <Typography variant="body1">
              Recommended food preparation amount: {prediction.toFixed(2)} kg
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              This is an estimate based on historical data for similar events
            </Typography>
          </Paper>
        )}
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Food Item</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Quantity Prepared</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Quantity Wasted</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Waste %</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No data available. Start by adding some entries!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow
                    key={item._id}
                    sx={{ 
                      "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                      "&:hover": { backgroundColor: "action.selected" }
                    }}
                  >
                    <TableCell sx={{ fontWeight: "500" }}>{item.notes}</TableCell>
                    <TableCell>
                      {(item.foodPrepared || 0).toFixed(2)} kg
                    </TableCell>
                    <TableCell>
                      {(item.foodWasted || 0).toFixed(2)} kg
                    </TableCell>
                    <TableCell>
                      {(((item.foodWasted || 0) / (item.foodPrepared || 1)) * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      {new Date(item.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
          Historical Event Data
        </Typography>
        
        {isMLDataLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : mlData.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No historical data available
          </Typography>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Event Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Attendees</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Food Prepared (kg)</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Food Consumed (kg)</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Wasted Food (kg)</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Waste %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mlData.map((item) => {
                  const wastePercentage = ((item.wasted_food / item.food_prepared) * 100).toFixed(1);
                  return (
                    <TableRow 
                      key={item._id}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                        '&:hover': { backgroundColor: 'action.selected' }
                      }}
                    >
                      <TableCell>
                        {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>{item.event_type}</TableCell>
                      <TableCell>{item.attendees}</TableCell>
                      <TableCell>{item.food_prepared.toFixed(2)}</TableCell>
                      <TableCell>{item.food_consumed.toFixed(2)}</TableCell>
                      <TableCell 
                        sx={{ 
                          color: wastePercentage > 20 ? 'error.main' : 'success.main',
                          fontWeight: 'medium'
                        }}
                      >
                        {item.wasted_food.toFixed(2)}
                      </TableCell>
                      <TableCell
                        sx={{ 
                          color: wastePercentage > 20 ? 'error.main' : 'success.main',
                          fontWeight: 'medium'
                        }}
                      >
                        {wastePercentage}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
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

export default Dashboard;
