import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page after 2 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
      }}
    >
      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          fontSize: { xs: '3rem', sm: '4rem', md: '6rem' },
          animation: 'fadeIn 1s ease-in',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(20px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        nourishIQ
      </Typography>
    </Box>
  );
};

export default SplashScreen; 