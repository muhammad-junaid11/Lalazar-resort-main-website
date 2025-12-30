import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import PetsIcon from '@mui/icons-material/Pets';
import SecurityIcon from '@mui/icons-material/Security';
import WifiIcon from '@mui/icons-material/Wifi';
import { useTheme } from '@mui/material/styles';

const features = [
  { 
    title: 'Restaurant', 
    description: 'Welcome to our exquisite restaurant, where culinary excellence meets a warm and inviting ambiance.', 
    icon: RestaurantIcon 
  },
  { 
    title: 'Free Parking', 
    description: 'At our establishment, we offer the convenience of complimentary parking for all our valued guests.', 
    icon: LocalParkingIcon 
  },
  { 
    title: 'Child-friendly', 
    description: 'At our establishment, we warmly welcome families and provide a child-friendly environment.', 
    icon: ChildFriendlyIcon 
  },
  { 
    title: 'Full-service laundry', 
    description: 'At our establishment, we take the hassle out of laundry with our comprehensive full-service laundry facilities.', 
    icon: LocalLaundryServiceIcon 
  },
  { 
    title: 'Pet Friendly', 
    description: 'Pets are an integral part of many families and we are delighted to welcome our furry companions with open arms.', 
    icon: PetsIcon 
  },
  { 
    title: '24/7 Security', 
    description: 'Ensuring the safety and security of our guests is our priority. We maintain a 24/7 security system.', 
    icon: SecurityIcon 
  },
  { 
    title: 'Unlimited Wifi System', 
    description: 'Our unlimited WiFi system is designed to provide seamless, high-speed internet.', 
    icon: WifiIcon 
  },
];

const CoreFeatureAbout = () => {
  const theme = useTheme();

  
  const FeatureCard = ({ title, description, icon: Icon }) => (
    <Box
      sx={{
        p: 3,
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: 2,
        minHeight: '200px', 
        textAlign: 'left',
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: `0 8px 16px rgba(0, 0, 0, 0.1)`,
          borderColor: theme.palette.secondary.main,
        },
      }}
    >
      <Icon sx={{ color: theme.palette.secondary.main, fontSize: 40, mb: 1.5 }} />
      <Typography variant="h6" sx={{ mb: 1,fontWeight:"bold" }}>
  {title}
</Typography>
<Typography variant="body1">
  {description}
</Typography>

    </Box>
  );

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: theme.palette.secondary.main, 
              letterSpacing: 2, 
              fontWeight: 500 
            }}
          >
            Features
          </Typography>
          <Typography
  variant="h3"
  sx={{
    mb: 2,
    color: theme.palette.secondary.main,
  }}
>
  Core Facilities
</Typography>

        </Box>

        <Grid container spacing={3} justifyContent="center">
          {features.map((feature, index) => (
            <Grid 
              key={index} 
              item 
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            >
              <FeatureCard {...feature} />
            </Grid>
          ))}
          <Grid item size={{ md: 4, lg: 3 }} sx={{ display: { xs: 'none', md: 'block' } }} />
        </Grid>
      </Container>
    </Box>
  );
};

export default CoreFeatureAbout;