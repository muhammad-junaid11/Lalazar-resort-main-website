import React from 'react';
import { Box, Typography, Card, CardContent, Button, List, ListItem, ListItemIcon, ListItemText, Grid, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import hotelBg from '../../assets/hotelBg.jpg'; // Replace with your image path

const HotelPlans = () => {
  const theme = useTheme();

  const FeatureList = ({ features }) => (
    <List dense sx={{ padding: 0 }}>
      {features.map((feature, index) => (
        <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: '30px' }}>
            <CheckIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText
            primary={feature}
            primaryTypographyProps={{ style: { color: theme.palette.text.primary }, fontSize: '0.95rem' }}
          />
        </ListItem>
      ))}
    </List>
  );

  const deluxePlan = {
    title: 'Deluxe Room',
    price: '14500',
    features: ['Food take-way option', 'Easy To Access Door', 'Support 24/7 Online'],
  };

  const luxuryPlan = {
    title: 'Luxury Room',
    price: '17500',
    features: ['Food take-way option', 'Easy To Access Door', 'Support 24/7 Online'],
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        backgroundImage: `url(${hotelBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Stronger overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          zIndex: 0,
        }}
      />

      <Grid container spacing={4} sx={{ zIndex: 1 }}>
        {/* Left Side: 2 Cards */}
        <Grid size={{ xs: 12, sm: 6}}>
          <Grid container spacing={3}>
            {[deluxePlan, luxuryPlan].map((plan, index) => (
              <Grid size={{ xs: 12, sm: 6}} key={index}>
                <Card
                  sx={{
                    p: 2,
                    borderRadius: '8px',
                    minHeight: '470px',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1, color: theme.palette.primary.main, fontWeight: 'bold' }}>
                      {plan.title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3, color: theme.palette.primary.main }}>
  {plan.price}
  <Box component="span" sx={{ ml: 1, fontSize: '1.25rem', verticalAlign: 'super' }}>
    Rs
  </Box>
</Typography>

                    <FeatureList features={plan.features} />
                  </CardContent>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 2,
                      backgroundColor: theme.palette.secondary.main,
                      color: '#fff',
                      '&:hover': { backgroundColor: theme.palette.secondary.dark },
                      textTransform: 'none',
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Make Your Order
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right Side: Centered Hotel Plans */}
        <Grid
          item
         size={{ xs: 12, sm: 6}}
          sx={{
            color: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center', width: { xs: '100%', sm: '500px' } }}>
            <HomeIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 1 }} />
            <Typography variant="h2" sx={{ fontWeight: 400, mb: 2, fontSize: { xs: '2rem', sm: '3rem' } }}>
              Hotel Plans
            </Typography>
            <Typography variant="body1" sx={{ mb: 5, fontSize: '1.1rem' }}>
              Choose from our diverse range of hotel plans tailored to meet your unique preferences.
            </Typography>

            {/* Flexible + Anytime horizontal boxes with equal width */}
            <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
              {['Flexible Price', 'Anytime Discharge'].map((title, idx) => (
                <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                  <Box
                    sx={{
                      border: `2px solid ${theme.palette.secondary.main}`,
                      borderRadius: '8px',
                      p: 3,
                      minHeight: '120px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{title}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85, textAlign: 'center' }}>
                      {title === 'Flexible Price'
                        ? 'Prices are based on the services and facilities provided.'
                        : 'Freedom to checkout at any time according to your schedule.'}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HotelPlans;
