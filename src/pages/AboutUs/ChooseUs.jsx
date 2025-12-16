import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Divider } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import chooseUsImage from '../../assets/img1.webp'; 
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const reasons = [
  { id: 1, text: 'Luxurious Room' },
  { id: 2, text: 'Beautiful Exterior' },
  { id: 3, text: 'Delicious Cuisine' },
  { id: 4, text: 'Play Area For Kids' },
];

const WhyChooseUs = () => {
  const theme = useTheme();
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const navigate = useNavigate();

  const reasonRoutes = {
    "Luxurious Room": "/rooms/luxury-room",
    "Beautiful Exterior": "/activities",
    "Delicious Cuisine": "/services",
    "Play Area For Kids": "/services",
  };

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Section: Reasons */}
          <Grid size={{ xs: 12, md: 7 }}> 
            <Box>
              <Typography variant="overline" sx={{ color: theme.palette.secondary.main, letterSpacing: 2 }}>
                Why Choose
              </Typography>
              <Typography variant="h3" sx={{ mb: 2, color: theme.palette.secondary.main }}>
                Why Choose Us
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {reasons.map((reason) => (
                  <Box
                    key={reason.id}
                    onMouseEnter={() => setHoveredItemId(reason.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    onClick={() => {
                      if (reason.text === "Beautiful Exterior") {
                        navigate(reasonRoutes[reason.text], { state: { scrollTo: "trekking-section" } });
                      } else if (reason.text === "Delicious Cuisine") {
                        navigate(reasonRoutes[reason.text], { state: { scrollTo: "cuisine-section" } });
                      } else if (reason.text === "Play Area For Kids") {
                        navigate(reasonRoutes[reason.text], { state: { scrollTo: "play-area-section" } });
                      } else {
                        navigate(reasonRoutes[reason.text]);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    sx={{
                      p: 3,
                      border: `1px solid ${theme.palette.grey[300]}`,
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease, border-color 0.3s ease',
                      backgroundColor: hoveredItemId === reason.id 
                        ? theme.palette.secondary.main 
                        : 'transparent',
                      color: hoveredItemId === reason.id 
                        ? theme.palette.primary.contrastText 
                        : theme.palette.text.primary, 
                      '&:hover': { borderColor: theme.palette.secondary.main },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: hoveredItemId === reason.id ? 'inherit' : theme.palette.text.primary, transition: 'color 0.3s ease', fontWeight: "bold" }}>
                      {reason.text}
                    </Typography>
                    <ArrowForwardIcon sx={{ fontSize: 24, color: hoveredItemId === reason.id ? theme.palette.primary.contrastText : theme.palette.text.secondary, transition: 'color 0.3s ease' }} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Right Section: Image */}
          <Grid size={{ xs: 12, md: 5 }}> 
            <Box
              component="img"
              src={chooseUsImage}
              alt="Why Choose Us"
              sx={{
                width: '100%',
                height: { xs: 300, md: 480 }, 
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: `0 10px 20px rgba(0, 0, 0, 0.1)`,
              }}
            />
          </Grid>
        </Grid>
      </Container>
      <Divider sx={{ mt: 22, mb: 2 }} /> 
    </Box>
  );
};

export default WhyChooseUs;
