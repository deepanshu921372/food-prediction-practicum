import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EventIcon from '@mui/icons-material/Event';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      height: '100%',
      background: `linear-gradient(45deg, ${color}22 30%, ${color}11 90%)`,
      border: `1px solid ${color}33`,
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
      }
    }}
  >
    <Box display="flex" alignItems="center" gap={2}>
      <Box
        sx={{
          backgroundColor: `${color}22`,
          borderRadius: '12px',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" fontWeight="bold" color={color}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const StatisticsCards = ({ data }) => {
  const totalPrepared = data.reduce((sum, item) => sum + (item.foodPrepared || 0), 0);
  const totalWasted = data.reduce((sum, item) => sum + (item.foodWasted || 0), 0);
  const wastePercentage = totalPrepared ? ((totalWasted / totalPrepared) * 100).toFixed(1) : 0;
  const totalEvents = data.length;

  return (
    <Grid container spacing={3} sx={{ mb: 8 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Food Prepared"
          value={`${totalPrepared.toFixed(2)} kg`}
          icon={<RestaurantIcon sx={{ color: '#2196f3' }} />}
          color="#2196f3"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Food Wasted"
          value={`${totalWasted.toFixed(2)} kg`}
          icon={<DeleteIcon sx={{ color: '#f44336' }} />}
          color="#f44336"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Waste Percentage"
          value={`${wastePercentage}%`}
          icon={<TrendingDownIcon sx={{ color: '#ff9800' }} />}
          color="#ff9800"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Events"
          value={totalEvents}
          icon={<EventIcon sx={{ color: '#4caf50' }} />}
          color="#4caf50"
        />
      </Grid>
    </Grid>
  );
};

export default StatisticsCards; 