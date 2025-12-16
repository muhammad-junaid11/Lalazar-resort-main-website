// src/components/Common/HeroSection.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const HeroSection = ({ title, subtitle, bgImage }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: 400, md: 500 },
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        position: 'relative',
        textAlign: 'center',
        zIndex: 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: -1,
        },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontSize: { xs: '14px', md: '16px' },
          color: 'rgba(255, 255, 255, 0.8)',
          mb: 1,
        }}
      >
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
  Home
</Link>
{subtitle && ` | ${subtitle}`}

      </Typography>

      <Typography
        variant="h2"
        sx={{
          fontFamily: 'serif',
          fontWeight: 'bold',
          fontSize: { xs: '3rem', md: '5rem' },
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default HeroSection;
