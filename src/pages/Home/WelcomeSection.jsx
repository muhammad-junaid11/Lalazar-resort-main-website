import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
import wc from '../../assets/wc.webp';

const WelcomeSection = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: '100vh',
        p: { xs: 2, md: 4 },
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: { xs: '100%', md: '500px' },
        }}
      >
        <img
          src={wc}
          alt="Hotel"
          style={{
            width: '100%',
    maxWidth: '400px', 
    height: 'auto',
            objectFit: 'cover',
            borderRadius: '12px',
            boxShadow: theme.shadows[4],
          }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: { xs: 'center', md: 'flex-start' },
          textAlign: { xs: 'center', md: 'left' },
          maxWidth: { xs: '100%', md: '540px' },
        }}
      >
        <Typography variant="h4" sx={{ color: theme.palette.secondary.main, mb: 1 }}>
  <CottageOutlinedIcon sx={{ fontSize: '3rem' }} />
</Typography>

<Typography variant="h3" sx={{ mb: 1 }}>
  Welcome To Our
</Typography>

<Typography
  variant="h3"
  sx={{ mb: 3, color: theme.palette.secondary.main }}
>
  Luxury Hotel & Resort
</Typography>


        <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
          Indulge in a world of unparalleled luxury and bespoke hospitality at our esteemed hotel and resort, where every moment is crafted to offer an unforgettable experience. Nestled amidst the breathtaking natural beauty of [Location], our property boasts a fusion of contemporary elegance and timeless charm, promising an escape like no other.
        </Typography>

        <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
          Immerse yourself in the opulence of our meticulously designed suites, each exuding a seamless blend of modern sophistication and classic allure. From panoramic views of the rolling hills to the serene embrace of azure waters, our accommodations offer a sanctuary of comfort and refinement.
        </Typography>
      </Box>
    </Box>
  );
};

export default WelcomeSection;
