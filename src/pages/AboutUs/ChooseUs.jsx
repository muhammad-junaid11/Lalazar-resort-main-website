// src/components/About/WhyChooseUs.jsx

import React, { useState } from 'react';
import { Box, Typography, Container, Grid,Divider } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// Assuming you have renamed the image path to use the correct one for the component
import chooseUsImage from '../../assets/img1.webp'; 
import { useTheme } from '@mui/material/styles';

const reasons = [
  { id: 1, text: 'Luxurious Room' },
  { id: 2, text: 'Beautiful Exterior' },
  { id: 3, text: 'Delicious Cuisine' },
  { id: 4, text: 'Play Area For Kids' },
];

const WhyChooseUs = () => {
  const theme = useTheme();
  const [hoveredItemId, setHoveredItemId] = useState(null);

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          
          {/* Left Section: Reasons to Choose Us (WIDER - Takes 7/12 columns on desktop) */}
          <Grid size={{ xs: 12, md: 7 }} > 
            <Box>
              <Typography 
                variant="overline" 
                sx={{ 
                  color: theme.palette.secondary.main, 
                  letterSpacing: 2, 
                  fontWeight: 500 
                }}
              >
                Why Choose
              </Typography>
              <Typography
                variant="h3"
               sx={{
            fontWeight: 700,
            mb: 2,
            fontFamily: '"Georgia",serif',
            color: theme.palette.secondary.main,
            fontSize: { xs: '2.5rem',sm:'3rem', md: '3.5rem' },
          }}
              >
                Why Choose Us
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {reasons.map((reason) => (
                  <Box
                    key={reason.id}
                    onMouseEnter={() => setHoveredItemId(reason.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
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
                      '&:hover': {
                        // Maintain the border color change on hover, even if background state is managed by useState
                        borderColor: theme.palette.secondary.main,
                      },
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: hoveredItemId === reason.id 
                            ? 'inherit' 
                            : theme.palette.text.primary,
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {reason.text}
                    </Typography>
                    <ArrowForwardIcon 
                      sx={{ 
                        fontSize: 24,
                        color: hoveredItemId === reason.id 
                            ? theme.palette.primary.contrastText 
                            : theme.palette.text.secondary, 
                        transition: 'color 0.3s ease',
                      }} 
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Right Section: Image (NARROWER - Takes 5/12 columns on desktop) */}
          <Grid size={{ xs: 12, md: 5 }} > 
            <Box
              component="img"
              src={chooseUsImage}
              alt="Why Choose Us"
              sx={{
                width: '100%',
                // Adjust height to maintain a good aspect ratio against the text list
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